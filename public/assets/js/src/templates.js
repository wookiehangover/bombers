(function(){this.JST || (this.JST = {});this.JST["test"] = function(context) { return HandlebarsTemplates["test"](context); };this.HandlebarsTemplates || (this.HandlebarsTemplates = {});this.HandlebarsTemplates["test"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


  stack1 = helpers.wuuut || depth0.wuuut
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
  else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "wuuut", { hash: {} }); }
  buffer += escapeExpression(stack1) + "\n";
  return buffer;});}).call(this);