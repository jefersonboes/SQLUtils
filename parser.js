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

		var state = 0;

		while (has_token()) {
			switch(state) {
				case 0:
					if (cur_token() == "'") {
						state = 1;
					}
					next_token();
					break;
				case 1:
					if (cur_token() == "'") {
						if (second_token() != "'") {
							state = 3;
							next_token();
						} else {
							var count_quotes = 0;

							while (cur_token() == "'") {							
								count_quotes++;

								next_token();
							}

							sql += "'".repeat(count_quotes / 2);

							//closed
							if (count_quotes % 2 == 1) {
								state = 3;
								next_token();
							} else {
								state = 2;
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
					sql += "\n";

					state = 0;
					next_token();
					break;
			}
			
		}
	}
	
	this.get_sql = function() {
		return sql;
	}

	extract_sql(text);
}

function MendANSIEncoding(text) {
	var index = 0;
	var str = text;
	var new_str = '';

	var next_token = function() {		
        index += 1;
    }

    var get_token = function() {
        return str[index];
    }

    var get_double_token = function() {
        return str[index] + str[index + 1];
	}

    var has_token = function() {
        return index < str.length;
    }
        
    var mend = function() {
        index = 0;        

        while (has_token()) {
            if (get_token() == 'Ã') {
            	const tokens = [['Ã©', 'é'], ['Ãª', 'ê'], ['Ãº', 'Ú'], ['Ã§', 'ç'], ['Ã£', 'ã']];

            	for (var i = 0; i < tokens.length; i++) {
            		if (get_double_token() == tokens[i][0]) {
            			new_str += tokens[i][1];
                    	next_token();
                    	break;
            		}
            	}                
            } else {
                new_str += get_token();
            }
                    
            next_token();
        }
    }

    this.get_str = function() {
    	return new_str;
    }

    mend();
}
