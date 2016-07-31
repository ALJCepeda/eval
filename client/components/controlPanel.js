define(['scripts/injector', 'bareutil.val'], function(Injector, val) {
	var ControlPanel = function(meta, themes) {
		var self = this;

		this.id = '';
		this.shouldSubmit;
		this.changedPlatform;
		this.changedTheme;

		this.meta = ko.observable(meta);
		this.theme = ko.observableArray(themes);
		this.selectedPlatform = ko.observable('');
		this.selectedTag = ko.observable('');
		this.selectedTheme = ko.observable('');

		this.selectedPlatform.subscribe(function(platform) {
			var platformInfo = self.meta()[platform];
			var aceMode = platformInfo.aceMode;

			self.changedPlatform(platform, aceMode);
		});

		this.selectedTheme.subscribe(function(theme) {
			self.changedTheme(theme || 'monokai');
		});

		this.disabled = ko.computed(function() {
			return self.selectedPlatform() === '' || self.selectedTag() === '';
		});

		this.platforms = ko.computed(function() {
			var meta = self.meta();
			var newPlatforms = [];

			for(var key in meta) {
				var platform = { value:key, text:meta[key].name };
				newPlatforms.push(platform);
			}

			return newPlatforms;
		});

		this.tags = ko.computed(function() {
			var meta = self.meta();
			var platform = self.selectedPlatform();
			var platformInfo = meta[platform];
			var newTags = [];

			[].push.apply(newTags, meta[platform].tags.map(function(tag) {
				return { value: tag, text: tag };
			}));

			self.selectedTag('latest');
			return newTags;
		});
	};

	ControlPanel.prototype.onClick = function() {
		if(this.disabled() === false) {
			var platform = this.selectedPlatform();
			var tag = this.selectedTag();

			var shouldDismiss = this.didSubmit(platform, tag);
			if(shouldDismiss === true) {
				this.close();
			}
		}
	};

	ControlPanel.prototype.inject = function(id) {
		var injector = new Injector('/');
		this.id = id;
		return injector.inject('#'+id, 'components/controlPanel', this);
	};

	ControlPanel.prototype.onSubmit = function() {
		var platform = self.selectedPlatform();
		var tag = self.selectedTheme();

		this.shouldSubmit(platform, theme);
	};

	return ControlPanel;
});
