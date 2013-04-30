angular.module('myApp').controller('AnalysisCtrl', ['$scope', '$location', 'FBService', 'ErrorMessageService',
    function ($scope, $location, FBService, ErrorMessageService) {
        'use strict';

        var getFeedData = function () {
            var feed = FBService.getCachedFeed(); //at this point we should already have a feed available
            var retval = {name: "Feed", children: []};

            if (angular.isUndefined(feed))
                return retval;

            $.each(feed, function (index, post) {
                    var displayValue = FBService.extractPostStory(post);
                    retval.children.push({
                        name: post.from.name,
                        size: displayValue.length
                    })
                }
            )
            ;

            return retval;
        };


        var r = 960,
            format = d3.format(",d"),
            fill = d3.scale.category20c();

        var bubble = d3.layout.pack()
            .sort(null)
            .size([r, r])
            .padding(1.5);

        var vis = d3.select("#chart").append("svg")
            .attr("width", r)
            .attr("height", r)
            .attr("class", "bubble");

        var node = vis.selectAll("g.node")
            .data(bubble.nodes(classes(getFeedData()))
                .filter(function (d) {
                    return !d.children;
                }))
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function (d) {
                return d.className + ": " + format(d.value);
            });

        node.append("circle")
            .attr("r", function (d) {
                return d.r;
            })
            .style("fill", function (d) {
                return fill(d.packageName);
            });

        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .text(function (d) {
                return d.className.substring(0, d.r / 3);
            });

// Returns a flattened hierarchy containing all leaf nodes under the root.
        function classes(root) {
            var classes = [];

            function recurse(name, node) {
                if (node.children) node.children.forEach(function (child) {
                    recurse(node.name, child);
                });
                else classes.push({packageName: name, className: node.name, value: node.size});
            }

            recurse(null, root);
            return {children: classes};
        }


    }])
;