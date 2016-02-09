/**
 * Created by ryanpfister on 3/23/15.
 */


(function(validators){
	validators.requiredStringArrayValidator = [
		function(val){
			if(val == null){
				return false;
			}

			return _.some(val, function(str){
				return str != null && str.trim().length > 0;
			})
		}
	];

	validators.requiredStringValidator = [
		function (val) {
			var testVal = val.trim();
			return (testVal.length > 0)
		},
		// Custom error text...
		'{PATH} cannot be empty' ];

	validators.maxStringLengthValidator = [
		function(val){
			return val.trim().length <= 500;
		},
		"Your string is too long..."
	]


})(module.exports);