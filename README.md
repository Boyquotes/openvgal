https://github.com/lbartworks/openvgal/assets/121262093/517b6b67-7a87-4f2c-8166-b5c9314ff9e9


# OpenVgal v2.2

 (Open source Virtual Gallery)
Virtual 3D gallery for art showcase. Based on Babylon.js
If you want to receive updates, subscribe to the [newsletter](https://nostromophoto.com/newslettter/)

-----------------------------------------

Version 2 brought some significant improvements:
- Making it easier for anyone to test it in their own computer. I have packed all into a single executable.
- An installation video is available.
- Improvements in lights and galleries

Version 2.1 incorporates a banner or overlay at the bottom, permanently shown to help:
- Getting help on how to navigate
- Show information on artworks
- Navigate automatically the gallery, placing you in front 
- (potentially) Redirect your visitor to purchase/mint artwork

Version 2.2 incorporates the Babylon library to make sure works on subsequent Babylon JS updates. Currently uses v8.25

OpenVgal started in June 2022 as a personal project to provide myself, or anyone, a way to build an interactive 3D virtual gallery programmatically. What this means is that you do not need to design the hall or halls of the galleries, or deal with the 3D work, or the browser code to move around it. You just need organize your collections in folders and run some code provided here.  I was inspired by what Oncyber was creating but they had not open sourced the project. 

A demonstration of the gallery can be seen here:
[https://nostromophoto.com/virtual/virtual.html](https://nostromophoto.com/virtual/virtual.html)

Although in v1.4 the effort/skills had dropped significantly from v0.1 it was by no means a one-click process, heavily restricting the scope of artists who are less savvy. V2 is delivered in two different ways:

* An executable installer (available in Windows, Macos and Linux)

* Download the source code and run it with your own version of Python. For those who want full control on the execution process, requires that you install Python on your own.

🎨 If you want to create your own galleries you can go directly to the [How to create your gallery](#1-steps-to-create-a-gallery) section.

🙏 If you want to support this development and/or want to collect some of my artwork, you can see my NFTs here:
[https://opensea.io/LB_Artworks](https://opensea.io/LB_Artworks)
  You can also purchase the Kraken gallery to use in inside Oncyber:
[Kraken gallery in Rarible](https://rarible.com/token/0x449f661c53ae0611a24c2883a910a563a7e42489:181)

### SHORTCUTS
👉 To create your own virtual gallery [click here](#1-steps-to-create-a-gallery)

👉 To learn about the structure of OpenVGal [click here](#2-structure-of-openvgal)

👉 To learn how to customize OpenVgal [click here](#3-customize-openvgal)

👉 To see the changelog [click here](#4-changelog)

*Disclaimer:* I am not an expert in javascript, electron or Babylon.js. If you find parts of the code that can be written in a more academic way, feel free to help.

```
v2.0.2 MD5
Windows: ae17b08853f30edb93c5c7519395715e
Linux: 6ea8f1e08693c9b402698540df92a899
Mac: 9990f05055b6a24e28b1f1310ae218f5
```

```
v2.1.0 sh256
Windows: 3b4c14d0cdcb0ba83cd0014e5e17b19692a4b484163b37105c8370b76ab4f4d2
Linux: e2a0076d68f1db003a8f51a63a78d387ecd5e88005f335e293a547d5c76b96a9
Mac: 3f3aa9d0b272db97bb3d672aa19f1c1470d3c0b1c26d2931e2b093d40ae004fc
```

## 1. Steps to create a gallery
Follow the easy or advanced tutorials, available here:

[Tutorial (basic)](https://youtu.be/Zd2ZD8ARcvA)

[Tutorial (advanced)](https://youtu.be/mI_V_jZfu6g)


### Tips creating your own galleries

1. Organize each of the artwork images for each art hall on a different folder. Put all the images (1 Mpix advised) of each hall in one folder. Similarly to the example, where the folder gallery1 contains the artworks that later will be shown in the same art hall.
10. Create a spreadsheet (see [example](python/building_v2.csv)) with the .csv fields and save it. You need to assign a gallery name (preferrably not very long) to each folder with images. That will be the name displayed on the door. You can overwrite the existing csv file for simplicity. Remember that, for the moment, all galleries need to be parented by the root gallery. If the folder contains a large number of images (hundreds), the python code will break it up in smaller art halls automatically.

2. Customize your `materials/logo.png` file to show in the hub hall. Use the existing one as a reference for size.

3. If you cannot put the conent folder of OpenVGal in the root folder of a web server, you need to customize the variables in the `gallery_viewer.html` file depending on the folder where you placed the files in the web server.

```
	const glb_location='/openvgal/templates/';
	const config_file_name='/openvgal/building_v2.json';
	const materials_folder='/openvgal/materials';
	const hallspics_prefix= '/openvgal';
	const icons_folder='/openvgal/icons';
	
	const aux_javascript= '/openvgal/room_builder_aux.js';
```
Upload the files to the web server. Check the console in case of error. Most common errors are related to files not found due to changes in the variables above.

## 2. Structure of OpenVGal

The project is structured around three key elements:
-	A json file that describes the structure and content of the gallery halls.
-	Hall templates in the form of .glb files. Glb files is the binary version of [GLTF](https://en.wikipedia.org/wiki/GlTF), an open format to describe 3D scenes and models. Each template should be consistent with the .json generator.
-	A gallery visualizer that creates the virtual experience using a web browser

OpenVgal uses a *building_v2.json* file to describe the structure of galleries (_v2 aims to avoid confusion with the older versions) The format is aimed to be flexible enough to accommodate a single hall or interconnecting halls in an arbitrary structure (not completely arbitrary at the moment). It always starts with a root gallery hub hall. Each hall can have items. Items are: either an artwork (a picture) or a door connecting to another gallery. In this version hub halls can only have doors and artwork halls can have artworks and 1 or 2 doors.

The *building_v2.json* file follows a nested structure of dictionaries (dictionary is understood here as a data structure organized in the form of [name/value pairs](https://www.w3resource.com/JSON/structures.php)). 
The highest level structure (level 1) lists all the halls in the gallery.



#### Example of the level 1 structure:

```
{
“root”: root_dictionary,
“another_hall”: hall_dictionary,
…
“last_hall”: hallN_dictionary
h}
```

The `root_dictionary` or the `hallN_dictionary` are level 2 dictionaries describing the characteristics of the hall. Each level 2 dictionary  has three compulsory keys in the dictionary: 

* A **parent** field with the hall name that will give access to it. Note that the root hall has “none” as parent.
* A **resource** field with the name of a .glb file. Normally the file selected here will not exist and fall back to the next field. If it exist it will override any subsequent information about the items. It should be a fully designed gallery, including all the artworks.
* A **template** field with the name of a template .glb file. A template .glb file with start with "T_" and it simply contains an empty hall where the artworks will be placed.
* In addition to the three compulsory keys, it will have additional keys with the contents (items) of the hall.

#### Example of the level 1 and level 2 structure:
```
{
“root”:{
	“parent”: “none”,
	"resource": "root.glb",
	"template": "T_root.glb",
	“item1”:{…},
	“item2”: {…},
	“last item”: {…},
},
“another gallery”:{…},
“yet another gallery”: {…},
…
“last gallery”: {…}
}
```
Each of the **items** (`item1`, `item2`, etc...) consist of a level 3 dictionary with the following compulsory keys:
* A resource key with the path to the file containing either the picture or the gallery (a .glb file)
* A resource_type key that can have two values: [“door” | “image”]
width. 

In the case of resource_type=image, this additional keys are needed:
* A width and height key. They have values between 0 and 1. Depending on the aspect ratio, either the width or the height are expected to be equal to 1 and the other one lower than 1.
* A location key with 3 values containing the x,y,z position of the center of the item. Notice that here the "up" direction is the Z axis.
* A vector key with 2 values (x,y) that define a normal vector that identifies the orientation of the artwork (where does it face, to put in simple terms).
* A metadata key with text. That text will be shown when you hover on the artwork


#### Example of the level 1, 2 and 3 dictionaries:
```
{
“root”:{
	“parent”: “none”,
	"resource": "root.glb",
	"template": "T_root.glb",
	“another_gallery”:{
	   "resource": "another.glb",
       "resource_type": "door",
	},
	“item2”: {…},
	“last item”: {…},
},
“another gallery”:{
	“parent”: root,
	"resource": "another.glb",
	"template": "T_pannels.glb",
	"item1":{
	   	"resource": "gallery1/item1.jpg",
		"resource_type": "image",
	   	"width": "1.00",
       		"height": "0.74",
       		"location": "[15.0, -14.62573121343933, 2.0]",
       		"vector": "[-1.0, 0.0]",
       		"metadata": "ID #0 Beach bike"
	},
	“item2”: {…},
	“last item”: {…},
},
“yet another gallery”: {…},
…
“last gallery”: {…}
}
```

At the bottom the file contains a technical section:
```
  "Technical": {
    "ambientLight": 0.5,
    "pointLight": 50,
    "scaleFactor": 2.5,
    "verticalPosition": 0.4
  }

  ```
Small inconsistencies in this structure will be address in the next update of OpenVgal

## 2.1 Json file creation

Although it is possible to get the `building_v2.json` file created manually, as soon as several halls are interconnected with a few tens of items, this will not be practical. As an alternative python code is provided to generate the .json file based on a more intuitive .csv file The csv file will get the following fields or columns:

* Gallery name (name of the hall)

* Parent (hall name of the parent. "none" for the root)

* Folder (local filesystem folder with all the images of the hall)




	


## 2.2. Gallery viewer

The gallery viewer is an html page with javascript code to start the babylon engine and handle the following tasks:
- Read the `building_v2.json` file and create the root hall. For the root hall, or any other hall:
	- 	First it will try to to pull from the server a glb file with the name of the "resoure" field
 	- 	If it does not exist, it will try to pull up a glb file with a template version ("T_" prefix) of the "resource" field
  	-	If none exist is will create an error	 
- Creaate a kebyboard controller and camera to navigate the galleries in a first-person shooter style. You can rotate with the mouse and move in the four directions with the arrow keys. Tries to detect touch devices and adapt accordingly.
- Create an event listener for each door in a hall. When the visitor hovers on those doors the mouse icon changes. The user can teleport from one hall to another by clicking on the door
- If the user chooses another hall, the code pulls up in the background the .glb file and show a progress bar screen.
- Swap the scene contents but keep in memory the previous halls for faster interaction if the user returns to previously visited halls.


 

## 3. Customize OpenVGal
Openvgal default files provide a robust way to represent a large number of galleries and artwork. However, proficient programmers or designers would like to take it on step further. These are the customization options available from simpler to more complex

### 3.1 Customize materials
The templates used for the root hall or the art galleries have some BJS_ materials are pulled from the server (rather than embedded). In this way if you update the material contents in the server, you update the style. Note that you could customize and radically change the aspect of the galleries just with the materials.

### 3.2 Create new templates
OpenVgal provides currently 3 templates (T_root, T_pannels, T_nopannels) that act consistently with the VR_gallery.ipynb python code. You can add some non-structural element to the given templates and all should work fine. If you want structurally different galleries, you would need additionally a python object consistent with those new templates. To create new templates you would need the following steps:

FOR HUB HALLS

- New glb files with:
	* meshes for the doors named "d_0", "d_1", etc...
	* pointLight sources to be used later in Babylon. This simply fixes the position of the light, not the intensity. Notice that performance is affected as more lights are added.
	* Either normally embedded materials or materials with the prefix name "BJS_". In that case the gallery viewer will try to pull the material from the server.
- If the template has more than 10 doors you will need to modify the `doors_root=10` variable in `VR_gallery.ipynb`

FOR ARTWORK HALLS
- New glb files with:
	* meshes for the doors named "d_0", "d_1", etc... Meshes preferrably having a single plane.
	* pointLight sources to be used later in Babylon. This simply fixes the position of the light, not the intensity. Notice that performance is affected as more lights are added.
	* Either normally embedded materials or materials with the prefix name "BJS_". In that case the gallery viewer will try to pull the material from the server.
- A python classs equivalent to `class GalleryWithOptionalPanels` that you can see in the `VR_gallery.ipynb` file. The object must implement the following interfaces:
	* a `max_capacity()` function that returns the maximum number of artworks the template/s can accomodate
	* a `solve_gallery(N)` function that returns positions, vectors, template_gallery. The last one is a string with the corresponing .glb file. Notice that the same object can handle different templates, for example: for a small number of artworks (N), choose a small template, otherwise choose a larger one.


### 3.3 Create a full gallery
OpenVgal supports that you load directly a fully configured .glb file.



## 4. Changelog

:new: **Update (20 July 2025).** :new: 

New overlay wiht information, help and redirects

:new: **Update (21 April 2025).** :new: 

Electron app

:new: **Update (18 March 2024).** :new: 

New loadbar, more accurate. Useful for slow connections

:new: **Update (18 March 2024).** :new: 

My own experience as a user and the feedback from some of other early birds identified these areas of improvement:
- Automation in the creation of galleries. In v0.6 you had to assign everything manually
- Limitation on the size. What to do with more than 100 artworks, halls became too big.
- Lighting was very limited and realism required baking the textures which is not simple

so the developemnt direction had to go in the line of:
a) Full automation. Just pass over the contents of the galleries and the code should figure out how to distribute it
b) Scalability. Handle large galleries. More than 100 items was leading to huge galleries where all the inner space was unused.
c) Better native materials and lights. Baking textures gives a great visual aspect but is a pain in the ass and not easy to automate

In view of this I decided to do these main design changes:
- Remove room geometry by drawing primitives. I had the code written to incorporate internal panels in the hall but that would have been very difficutl to scale. Then only glb files are imported, either as full galleries or as spaces were items can be placed.
- For template glbs the json file would have the location of each item and the main engine would place these items in the empty template.

This has the advantage of designing very different templates. Most users will not want to deal with that, so a default template is provided. Actually 3 templates: one for the entrance hall, an exhibition hall with internal pannels and without them.

As a plus I added support for native node Babylon materials (wonderful Babylon team !!!) that are vey light and make it very easy to radically change the aspect of the galleries.


:new: **Update (22 December 2023).** :new: 

Touch devices are now detected and better supported. Instruction on how to move around on the initial screen. Info field when hovering on the artwork.
Im starting to do gallery designs. See below.

:new: **Update (22 August 2023).** :new: 

consistency updates in the repository 

:new: **Update (25 June 2023).** :new: 

Great visual improvement aspect of automatic galleries. The materials for the walls and floor are now on a style.json file. Less parameters hardwired into the code. More general way to generate the doors, they are one additional item in the north wall. Light position is dynamically adapted to the dimensions of the hall. White frames for the artworks.

:new: **Update (12 May 2023).** :new: 

An existing .glb template (hall) can now be populated with existing place-holders. This enables high-quality rendering and/or texture baking while the asset remain in the server and are loaded in real time.

:new: **Update (5 March 2023).** :new: 

ON-the-fly built incorporated. If the .glb objects are not available the code will try to build the hall from scratch based on the images. Of course the images and materials need to be available in the web server.





## FAQ

-	Could lights/shadows be incorporated? The best way to do that would be generating the halls with blender and bake (precalculate) the textures.


## TODO

- [ ]	Alternative hall templates, not simply a rectangular hall.
- [ ] Support for VR devices
- [ ] Code to detect overlapping artwork or erroneous configurations
- [ ] Support for lightmaps.  I have some experiments baking lightmaps, you can check them in this youtube [video](https://www.youtube.com/watch?v=mZzMPlagnQk)
- [x] On the fly rendering of the hall and items (pure babylon.js)
- [x] Hybrid mode where you load a glb with the hall but the items are loaded in real time
- [x] A blender based hall builder with textures baked manually.
- [X]	Better management of mobile devices
- [X]	Framing for artwork
- [X]	Titles and information for the artwork (improved now)




