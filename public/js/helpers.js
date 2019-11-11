var register = function(Handlebars) {
  var helpers = {
    // put all of your helpers inside this object
      block: function (name) {
           var blocks  = this._blocks,
               content = blocks && blocks[name];

           return content ? content.join('\n') : null;
       },

       contentFor: function (name, options) {
           var blocks = this._blocks || (this._blocks = {}),
               block  = blocks[name] || (blocks[name] = []);

           block.push(options.fn(this));
       }
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    // register helpers
    for (var prop in helpers) {
        Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
      // just return helpers object if we can't register helpers here
      return helpers;
  }

};

module.exports.register = register;
module.exports.helpers = register(null);
