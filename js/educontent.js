var mode;
function switchTo(element) {
	if (element != mode) {
		$('#edu_show').fadeOut('fast', function() {
			$('#edu_show').html($(element).html());
			$('#edu_show').fadeIn('fast');
		});
		mode = element;
	}	
}
switchTo('#edu_cs');
$("#csicon").click(function(){
	switchTo('#edu_cs');
});
$("#bioicon").click(function(){
	switchTo('#edu_bio');
});
$("#statsicon").click(function(){
	switchTo('#edu_stats');
});

var eduContent = angular.module('educontent', []).controller('educontentc', function($scope){
	$scope.csClassesLD = ["CS 61A: Structure and Interpretation of Computer Programs",
	    					"CS 61B: Data Structures",
	    					"CS 61C: Computer Architecture",
	    					"CS 70: Discrete Mathematics"];
	$scope.csClassesUD = ["CS 168: Internet Architecture and Protocols",
	    					"CS 170: Efficient Algorithms and Intractable Problems",
	    					"CS 176: Algorithms for Computational Biology",
	    					"CS 186: Database Systems",
	    					"CS 188: Artificial Intelligence",
	    					"CS 189: Machine Learning"];
	$scope.bioClassesLD = ["Bio 1A/B: General Biology",
							"Chem 3A/B: Organic Chemistry",
							"Physics 8A/B: Introductory Physics",
							"IB 35AC: Human Biological Variation"];
	$scope.bioClassesUD = ["MCB C100A: Biophysical Chemistry",
							"MCB 110: Macromolecular Synthesis",
							"MCB 140: Genetics",
							"NUSTX 110: Advanced Toxicology"];
	$scope.statsClassesLD = ["Math 53: Multivariable Calculus",
								"Math 54: Linear Algebra"];
	$scope.statsClassesUD = ["Stat 133: Statistical Programming/Computing",
								"Stat 134: Probability Theory",
								"Stat 135: Statistical Theory"];
});