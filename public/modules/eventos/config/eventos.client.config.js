'use strict';

// Configuring the Articles module
angular.module('eventos').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Eventos', 'eventos', 'dropdown', '/eventos(/create)?');
		Menus.addSubMenuItem('topbar', 'eventos', 'List Eventos', 'eventos');
		Menus.addSubMenuItem('topbar', 'eventos', 'New Evento', 'eventos/create');
	}
]);