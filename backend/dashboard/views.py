from django.shortcuts import HttpResponse, render
import time
import matplotlib.pyplot as plt
import numpy as np
from pyspline import libspline
from pygeo import DVGeometry
import io
import urllib, base64

# Create your views here.
def show_time(request):
    from django.http import JsonResponse
    t1 = time.localtime()  # 格式化格式
    s1 = time.strftime("%Y-%m-%d %H:%M:%S", t1)
    return JsonResponse({'code': 200,
                         'data': "Welcome to my demo! <br> Now："+s1,
                         'message': '提交成功'})

def index(request):
    return HttpResponse("Dashboard Pygeo Index")

def demogeometry(request):
    nffd = 10
    FFDbox = np.zeros((nffd, 2, 2, 3))
    xslice = np.zeros(nffd)
    yupper = np.zeros(nffd)
    ylower = np.zeros(nffd)

    xmargin = 0.001
    ymargin = 0.02
    yu = 0.5
    yl = -0.5

    # construct the i-j (x-y) plane grid of control points 10 x 2
    # we'll copy this along the k (z) axis later to make a cube
    for i in range(nffd):
        xtemp = i * 1.0 / (nffd - 1.0)
        xslice[i] = -1.0 * xmargin + (1 + 2.0 * xmargin) * xtemp
        yupper[i] = yu + ymargin
        ylower[i] = yl - ymargin

    # create the FFD box topology
    # 1st dim = plot3d i dimension
    # 2nd = plot3d j dimension
    # 3rd = plot3d k dimension
    # 4th = xyz coordinate dimension
    # the result is a three-axis tensor of points in R3
    FFDbox[:, 0, 0, 0] = xslice[:].copy()
    FFDbox[:, 1, 0, 0] = xslice[:].copy()
    # Y
    # lower
    FFDbox[:, 0, 0, 1] = ylower[:].copy()
    # upper
    FFDbox[:, 1, 0, 1] = yupper[:].copy()
    # copy
    FFDbox[:, :, 1, :] = FFDbox[:, :, 0, :].copy()
    # Z
    FFDbox[:, :, 0, 2] = 0.0
    # Z
    FFDbox[:, :, 1, 2] = 1.0

    # write the result to disk in plot3d format
    # the i dimension is on the rows
    # j and k are on newlines
    # k changes slower than j
    # xyz changes slowest of all
    f = open("ffdbox.xyz", "w")
    f.write("1\n")
    # header row with block topology n x 2 x 2
    f.write(str(nffd) + " 2 2\n")
    for ell in range(3):
        for k in range(2):
            for j in range(2):
                for i in range(nffd):
                    f.write("%.15f " % (FFDbox[i, j, k, ell]))
                f.write("\n")
    f.close()
    # create a pointset. pointsets are of shape npts by 3 (the second dim is xyz coordinate)
    # we'll generate a cylinder in parametric coordinates
    # the circular portion is in the x-y plane
    # the depth is along the z axis
    t = np.linspace(0, 2 * np.pi, 100)
    Xpt = np.zeros([200, 3])
    Xpt[:100, 0] = 0.5 * np.cos(t) + 0.5
    Xpt[:100, 1] = 0.5 * np.sin(t)
    Xpt[:100, 2] = 0.0
    Xpt[100:, 0] = 0.5 * np.cos(t) + 0.5
    Xpt[100:, 1] = 0.5 * np.sin(t)
    Xpt[100:, 2] = 1.0

    # rst create DVGeo
    # The Plot3D file ffdbox.xyz contains the coordinates of the free-form deformation (FFD)volume
    # we will be using for this problem. It's a cube with sides of length 1 centered on (0, 0,0.5).
    # The "i" direction of the cube consists of 10 points along the x axis
    # The "j" direction of the cube is 2 points up and down (y axis direction)
    # The "k" direction of the cube is 2 points into the page (z axis direction)
    FFDfile = "ffdbox.xyz"

    # initialize the DVGeometry object with the FFD file
    DVGeo = DVGeometry(FFDfile)

    # rst add pointset
    # add the cylinder pointset to the FFD under the name 'cylinder'
    DVGeo.addPointSet(Xpt.copy(), "cylinder")
    DVGeo.writePointSet("cylinder", "pointset")

    # rst add shape DV
    # Now that we have pointsets added, we should parameterize the geometry.

    # Adding local geometric design to make local modifications to FFD box
    # This option will perturb all the control points but only the y (up-down) direction
    DVGeo.addLocalDV("shape", lower=-0.5, upper=0.5, axis="y", scale=1.0)

    # rst getLocalIndex
    # The control points of the FFD are the same as the coordinates of the points in the input file
    # but they will be in a jumbled order because of the internal spline representation of the volume.
    # Let's put them in a sensible order for plotting.

    # the raw array of FFD control points (size n_control_pts x 3)
    FFD = DVGeo.FFD.coef

    # we can use the getLocalIndex method to put the coefs in contiguous order
    # the FFD block has i,j,k directions
    # in this problem i is left/right, j is up down, and k is into the page (along the cyl)
    # Let's extract a ring of the front-face control points in contiguous order.
    # We'll add these as a pointset as well so we can visualize them.
    # (Don't worry too much about the details)
    FFDptset = np.concatenate(
        [
            FFD[DVGeo.getLocalIndex(0)[:, 0, 0]],
            FFD[DVGeo.getLocalIndex(0)[::-1, 1, 0]],
            FFD[DVGeo.getLocalIndex(0)[0, 0, 0]].reshape((1, 3)),
        ]
    ).reshape(21, 3)

    # Add these control points to the FFD volume. This is only for visualization purposes in this demo.
    # Under normal circumstances you don't need to worry about adding the FFD points as a pointset
    DVGeo.addPointSet(FFDptset, "ffd")

    # Print the indices and coordinates of the FFD points for informational purposes
    print("FFD Indices:")
    print(DVGeo.getLocalIndex(0)[:, 0, 0])
    print("FFD Coordinates:")
    print(FFD[DVGeo.getLocalIndex(0)[:, 0, 0]])

    # Create tecplot output that contains the FFD control points, embedded volume, and pointset
    DVGeo.writeTecplot(fileName="undeformed_embedded.dat", solutionTime=1)

    # rst perturb geometry
    # Now let's deform the geometry.
    # We want to set the front and rear control points the same so we preserve symmetry along the z axis
    # and we ues the getLocalIndex function to accomplish this
    lower_front_idx = DVGeo.getLocalIndex(0)[:, 0, 0]
    lower_rear_idx = DVGeo.getLocalIndex(0)[:, 0, 1]
    upper_front_idx = DVGeo.getLocalIndex(0)[:, 1, 0]
    upper_rear_idx = DVGeo.getLocalIndex(0)[:, 1, 1]

    currentDV = DVGeo.getValues()["shape"]
    newDV = currentDV.copy()

    # add a constant offset (upward) to the lower points, plus a linear ramp and a trigonometric local change
    # this will shrink the cylinder height-wise and make it wavy
    # set the front and back points the same to keep the cylindrical sections square along that axis
    for idx in [lower_front_idx, lower_rear_idx]:
        const_offset = 0.3 * np.ones(10)
        local_perturb = np.cos(np.linspace(0, 4 * np.pi, 10)) / 10 + np.linspace(-0.05, 0.05, 10)
        newDV[idx] = const_offset + local_perturb

    # add a constant offset (downward) to the upper points, plus a linear ramp and a trigonometric local change
    # this will shrink the cylinder height-wise and make it wavy
    for idx in [upper_front_idx, upper_rear_idx]:
        const_offset = -0.3 * np.ones(10)
        local_perturb = np.sin(np.linspace(0, 4 * np.pi, 10)) / 20 + np.linspace(0.05, -0.10, 10)
        newDV[idx] = const_offset + local_perturb

    # we've created an array with design variable perturbations. Now set the FFD control points with them
    # and update the point sets so we can see how they changed
    DVGeo.setDesignVars({"shape": newDV.copy()})

    Xmod = DVGeo.update("cylinder")
    FFDmod = DVGeo.update("ffd")

    # Create tecplot output that contains the FFD control points, embedded volume, and pointset
    DVGeo.writeTecplot(fileName="deformed_embedded.dat", solutionTime=1)

    # rst plot
    # cast the 3D pointsets to 2D for plotting (ignoring depth)
    FFDplt = FFDptset[:, :2]
    FFDmodplt = FFDmod[:, :2]
    Xptplt = Xpt[:, :2]
    Xmodplt = Xmod[:, :2]

    # plot the new and deformed pointsets and control points
    cylinder = io.BytesIO()
    plt.figure()
    plt.title("Applying FFD deformations to a cylinder")

    plt.plot(Xptplt[:, 0], Xptplt[:, 1], color="#293bff")
    plt.plot(FFDplt[:, 0], FFDplt[:, 1], color="#d6daff", marker="o")

    plt.plot(Xmodplt[:, 0], Xmodplt[:, 1], color="#ff0000")
    plt.plot(FFDmodplt[:, 0], FFDmodplt[:, 1], color="#ffabab", marker="o")

    plt.xlabel("x")
    plt.ylabel("y")
    # plt.xlim([-0.7,1.2])
    plt.axis("equal")
    legend = plt.legend(
        ["original shape", "original FFD ctl pts", "deformed shape", "deformed FFD ctl pts"],
        loc="lower right",
        framealpha=0.0,
    )
    legend.get_frame().set_facecolor("none")
    plt.tight_layout()
    plt.savefig(cylinder, format="png")
    cylinder.seek(0)
    string = base64.b64encode(cylinder.read())
    uri = urllib.parse.quote(string)
    return render(request,'geometry.html',{'data':uri})