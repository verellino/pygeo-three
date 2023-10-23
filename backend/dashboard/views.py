from django.http import JsonResponse
from django.shortcuts import HttpResponse, render
import time
import matplotlib.pyplot as plt
import numpy as np
from pyspline import libspline
from pygeo import pyGeo
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
    # Number of airfoil sections
    naf = 10
    airfoil_list = ["rae2822.dat"] * naf

    # Airfoil leading edge positions
    x = np.linspace(0.0, 7.5, naf)
    y = np.linspace(0.0, 0.0, naf)
    z = np.linspace(0.0, 14.0, naf)

    offset = np.zeros((naf, 2))  # x-y offset applied to airfoil position before scaling

    # Airfoil rotations
    rot_x = [0.0] * naf
    rot_y = [0.0] * naf
    rot_z = [0.0] * naf

    # Airfoil scaling
    chord = np.linspace(5.0, 1.5, naf)

    # Run pyGeo
    wing = pyGeo(
        "liftingSurface",
        xsections=airfoil_list,
        scale=chord,
        offset=offset,
        x=x,
        y=y,
        z=z,
        rotX=rot_x,
        rotY=rot_y,
        rotZ=rot_z,
        tip="rounded",
        bluntTe=True,
        squareTeTip=True,
        teHeight=0.25 * 0.0254,
    )
    return render(request,'geometry.html',{'data':wing})