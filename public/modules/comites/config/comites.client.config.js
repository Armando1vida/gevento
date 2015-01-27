'use strict';

// Configuring the Articles module
angular.module('comites').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Comites', 'comites', 'dropdown', '/comites(/create)?');
		Menus.addSubMenuItem('topbar', 'comites', 'Listar Comités', 'comites');
		Menus.addSubMenuItem('topbar', 'comites', 'Crear Comité', 'comites/create');
	}
]);