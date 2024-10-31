<?php
if (! defined ('ABSPATH')) exit;
/**
 * Plugin Name: Swinging Hotspot interactive images
 * Description: Image hotspots - hover or click to pop-up labels, links, images.
 * Version: 1.05
 * Author: Kyle Golden
 * License: GPL2
 */
/*  Copyright 2022  Kyle Golden (email : kylegolden1994@gmail.com)
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License, version 2, as
    published by the Free Software Foundation.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
*/
$sp_f = true;
if (! isset ($qp_f)) {
   $qp_f = false;
}
include "globals.php";
include 'r-diagrams-plugin.php';
