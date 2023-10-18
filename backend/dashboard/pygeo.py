# External modules
import matplotlib.pyplot as plt
import numpy as np

# First party modules
from pygeo import DVGeometry

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
