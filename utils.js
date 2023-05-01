module.exports = {
	defineHtmlVars: function (html, variables = {}) {
		let normVars = html.match(/(\{\{).+(\}\})/gim);
		if (normVars && normVars.length) {
			normVars = normVars?.filter((i) => /.*[a-zA-Z0-9].*/.test(i));
			normVars.reverse().forEach((_var) => {
				let mainVar = _var.replace(/(\{\{|\}\}|\s)/gim, '');
				let regEx = new RegExp(_var, 'gi');
				if (variables[mainVar]) {
					html = html.replace(regEx, variables[mainVar]);
				} else {
					html = html.replace(
						'<body>',
						`<body><div style="font-size: 1.5rem;max-width: 50%; display: block; margin: 10px auto"><p style="background-color: #fecaca; color: #dc2626; padding: 10px; border-radius: 5px;">⭕️ ~ Set <span style="font-weight: bold">${mainVar}</span> variable</p></div>`,
					);
				}
			});
		}
		return html;
	},
};
