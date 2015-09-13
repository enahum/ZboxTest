/**
 * Created by enahum on 11-09-15.
 */
module.exports = [function() {
    return {
        restrict: 'E',
        scope:{
            user: '=',
            call: '&'
        },
        templateUrl: './app/views/partial/portfolio-item.html',
        link: function(scope, elem, attr) {
            var element = elem[0].querySelector('.portfolio-image .portfolio-overlay'),
                desc = element.querySelector('.portfolio-desc');

            if( desc) {
                var portfolioOverlayHeight = element.offsetHeight;
                var portfolioOverlayDescHeight = desc.offsetHeight;
                var portfolioOverlayIconHeight = 40 + 20;
                var portfolioOverlayMiddleAlign = ( portfolioOverlayHeight - portfolioOverlayDescHeight - portfolioOverlayIconHeight ) / 2;
                angular.element(desc).css({ 'margin-top': portfolioOverlayMiddleAlign + 'px'});
            }
        }
    };
}];
