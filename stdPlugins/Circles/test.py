import numpy as np
from skimage import measure, feature, io, color, draw

img = color.rgb2gray(io.imread("circle.jpg"))
img = feature.canny(img).astype(np.uint8)
img[img > 0] = 255

coords = np.column_stack(np.nonzero(img))

model, inliers = measure.ransac(coords, measure.CircleModel,
                                min_samples=3, residual_threshold=1,
                                max_trials=500)

print(model.params)

rr, cc = draw.circle(model.params[0], model.params[1], model.params[2],
                     shape=img.shape)

img[rr, cc] = 128