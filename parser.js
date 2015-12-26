/* SQL Utils - SQL Utils
 * Copyright (C) 2015 Jeferson Boes
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the
 * Free Software Foundation, Inc., 59 Temple Place - Suite 330,
 * Boston, MA 02111-1307, USA.
 */

function quote_str(text) {
	var result = "";

	var i = 0;

	while (i < text.length) {		
		if (text[i] == "'") {
			var qs = "";
			while (text[i] == "'") {
				qs += text[i];
				i++;
			}

			result += "'" + qs + "'";

			continue;
		} else 
			result += text[i];

		i++;
	}

	return result;
}

function concat_sql(text) {

	var split_text = text.split("\x0a");

	var new_text = "";

	for (var i = 0;  i < split_text.length; i++) {
		var s = trim(split_text[i]);

		s = quote_str(s);

		var ns = "'" + s + "'";

		if (i < split_text.length - 1)
			ns = ns + "#13+";

		new_text += ns;
		new_text += '\x0a';
	}

	return new_text;
}

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

function extract_begin_line(text) {
	var i = 0;
	var line = "";

	while (i < text.length) {		
		if (text[i] == "'") {
			
			while (text[i] == "'") {
				i++;
			}

			while (i < text.length) {
				line += text[i];
				i++;
			}
		} else
			i++;
	}

	return line;
}

function extract_end_line(text) {
	var i = text.length;

	while (i > 0) {
		if (text[i] == "'")
			break;

		i--;
	}

	console.log(text);

	return text.substr(0, i);
}

function extract_sql(text) {
	var split_text = text.split("\x0a");
	var result = "";

	for (var i = 0;  i < split_text.length; i++) {
		if (result.length > 0)
			result += '\x0a';

		var part = extract_begin_line(split_text[i]);
		result += extract_end_line(part);		
	}

	return result;
}
