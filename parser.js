/* SQL Utils - SQL Utils
 * Copyright (C) 2015, 2016 Jeferson Boes
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
			result += "'" + text[i];
		} else 
			result += text[i];

		i++;
	}

	return result;
}

function quote_sql(text) {

	var split_text = text.split("\x0a");

	var new_text = "";

	for (var i = 0;  i < split_text.length; i++) {
		var s = trim(split_text[i]);

		s = quote_str(s);

		var ns = "'" + s + "'";

		if (i < split_text.length - 1)
			ns = ns + "#13 +";

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

	return text.substr(0, i);
}

function Parser(text) {

	var tokens = null;
	var token_index = 0;
	var sql = "";

	var tokenize = function(text) {
		var token = "";
		tokens = new Array();	

		for (var i = 0; i < text.length; i++) {
			if (text[i] == "'") {
				if (token.length > 0) {
					tokens.push(token);
					token = "";
				}

				tokens.push("'");				
			} else if (text[i]) {
				token += text[i];
			}
		}

		if (token.length > 0)
			tokens.push(token);
	}

	var next_token = function() {
		if (token_index < tokens.length) {
			var token = tokens[token_index];
			token_index++;
			return token;
		} else
			return null;
	}

	var has_token = function() {
		return token_index < tokens.length;
	}

	var cur_token = function() {
		if (has_token())
			return tokens[token_index];
		else
			return null;
	}

	var second_token = function() {
		if (token_index + 1 < tokens.length)
			return tokens[token_index + 1];
		else
			return null;
	}

	var extract_sql = function(text) {
		tokenize(text);

		console.log("tokens:" + tokens);

		var state = 0;

		while (has_token()) {
			switch(state) {
				case 0:
					if (cur_token() == "'") {
						state = 1;
						next_token();
					} else {
						state = 2;
					}
					break;
				case 1:
					if (cur_token() == "'") {
						if (second_token() != "'") {
							state = 3;
							next_token();
						} else {
							//next_token();

							while (cur_token() == "'") {
								sql += "§";

								

								next_token();
							}


						}
					} else {
						state = 2;
					}

					break;
				case 2:
					sql += cur_token();

					next_token();
					state = 1;

					break;
				case 3:
					sql += "#";

					state = 0;
					next_token();
					break;
			}


			/*if (cur_token() == "'") {
				next_token();

				if (cur_token() == "'") {
					console.log("Q");
					sql += "'";

					if (second_token() != "'")
						sql += "\n";

					next_token();
					continue;
				} else {
					console.log("Al" + cur_token());

					if (cur_token() != null)
						sql += cur_token();

					next_token();

					if (second_token() != "'")
						sql += "\n";
				}

			}

			next_token();*/
		}
	}
	
	this.get_sql = function() {
		return sql;
	}

	extract_sql(text);
}
