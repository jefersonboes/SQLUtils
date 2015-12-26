
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
