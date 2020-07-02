# Calibrate applyai Vision plugin

<div style="float:left;">
<img src="./example_in.jpg" width="300" alt="Input image">
<img src="./example_out.jpg" width="300" alt="output image" >
</div>

## Description
This Plugin calibrates the camera. A certain number of pictures are taken with a chess board. The image is saved for ech shot and the corners of the chess board on the image are detected. As soon as all pictures have been taken, the calibration takes place. Obtained parameters are saved in Numpy files.

## Variables
- Number of chess board images required to calibrate
- Number of images that have been taken
- Vector that describes how the chess board should look for each image
- Vector that describes what the chess board looks like for each picture

## Returns
- Camera parameters including calibration matrix for future images

## Further Information
- [The applyai vision image processing software](../README.md)
- [How to install applyai vision plugins](../plugin-installation.md)
- [Standard applyai vision plugin API description](../plugin-standard-api.md)
- [Authors](../Authors.md)
- [License](../License.md)

