"use strict";

/**
 * JKY.Translation - process all Translation interface
 *
 * method:	JKY.Translation.load_values()
 *			JKY.Translation.set_value(key, value)
 *			JKY.Translation.get_value(key)
 *
 * example:	JKY.Translation.load_values();
 *			JKY.Translation.set_value('language', 'taiwanese');
 *			JKY.Translation.get_value('language');		//	taiwanese
 *
 * require:	JKY.Utils.js	(JKY.AJAX_URL)
 */
JKY.Translation = function() {
	var my_translation = [];

	/**
	 * translate
	 *
	 * @param	text
	 * @return	translated text
	 * @example JKY.t('Home')
	 */
	function translate(text) {
		if (text === '') {
			return '';
		}

		var result = my_translation[text];
		if (typeof result === undefined) {
			result = '';
			var names = text.split('<br>');
			for(var i=0; i<names.length; i++ ) {
				var name = names[i];
				var translation = my_translation[name];
				result += ( i === 0 ) ? '' : '<br>';
				if (typeof translation === undefined) {
					result += name;
				}else{
					result += translation;
				}
			}
		}
		return result;
	}

	return {
			set_translation	: function(array)		{		my_translation = array	;}
		,	translate		: function(text)		{return my_translate(text)		;}
	};
}();