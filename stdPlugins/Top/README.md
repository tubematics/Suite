# Top applyai Vision plugin

<div style="float:left;">
<img src="./example_in.jpg" width="300" alt="Input image">
<img src="./example_out.jpg" width="300" alt="output image" >
</div>

## Description
The Top plugin takes a gray image and detects objects in the front of the image. The theoretical profile of the object is compared to the visable profile of the object. Points are selected for testing by projecting a line from the center and rotating in increments of 10° If almost all selected points correspond to visable points it can be assumed that the object is in front. The plugin uses limits for the number of positive detections and the maximum distance between the theoretical points and the visable points.

## Variables
- maximal distance of point from ideal shape
- minimum points on an ideal shape in percent

## Returns
- modified image with isolated top objects

## Further Information
- [The applyai vision image processing software](../README.md)
- [How to install applyai vision plugins](../plugin-installation.md)
- [Standard applyai vision plugin API description](../plugin-standard-api.md)
- [Authors](../Authors.md)
- [License](../License.md)

