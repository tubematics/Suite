# FillGap applyai Vision plugin

<div style="float:left;">
<img src="./example_in.jpg" width="300" alt="Input image">
<img src="./example_out.jpg" width="300" alt="output image" >
</div>

## Description
The FillGap plugin takes a color image, converts it to a binary image and extracts the contours. In a first processing step the contours are enhanced by dilation (slightly). In a second processing step adjacent contours are joined by their closest points merging a set of contours to a detectable object.

## Variables
- Size of Kernel
- No of iterations
- Maximum gap size filled in / bridged in pixels
- Maximum number of contours analysed before exiting the plugin

## Returns
- modifiziertes Bild mit fertiggestellten, aber noch isolierten Objekten

## Further Information
- [The applyai vision image processing software](../README.md)
- [How to install applyai vision plugins](../plugin-installation.md)
- [Standard applyai vision plugin API description](../plugin-standard-api.md)
- [Authors](../Authors.md)
- [License](../License.md)

