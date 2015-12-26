
function concat_sql(text) {

	split_text = text.split("\x0a");

	new_text = "";

	for (i = 0;  i < split_text.length; i++) {
		s = trim(split_text[i]);

		ns = "'" + s + "'";

		if (i < split_text.length - 1)
			ns = ns + "#13+";

		new_text += ns;
		new_text += '\x0a';

		console.log(ns);
	}

	return new_text;
}

function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}
