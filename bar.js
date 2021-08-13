const margin =  {top: 100, bottom: 50, right: 20, left: 100};
const width = 960;
const height = 500;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const duration = 900;

//Creating the svg
const svg = d3.select('body').attr('align', 'center').append('svg').attr('width', width).attr('height', height);
const grp = svg.append('g').attr('transform', 'translate('+margin.left+', '+margin.right+')');
const xAxis = grp.append('g').attr('transform', `translate(0, ${innerHeight})`);
const yAxis = grp.append('g');

//Creating the tooltip that will be called later on 
const tooltip = d3.select('body').append('div')
                    .style('position', 'absolute')
                    .style('background', '#f4f4f4')
                    .style('padding', '5px')
                    .style('border', '1px #333 solid')
                    .style('border-radius', '5px')
                    .style('z-index', 10)
                    .style('visibility', 'hidden')

//Declaring the function that creates the charts
function chart(yStatus) {
        d3.csv("https://a0311773.scedt.tees.ac.uk/IV/TimeofSemester.csv")
        .then(
            function(data){
            const xScale = d3.scaleBand().domain(data.map(d => d.Week))
                                        .range([0, innerWidth]).padding(0.2);
            xAxis.transition().duration(duration).call(d3.axisBottom(xScale))
            const yScale = d3.scaleLinear().range([innerHeight, 0])
                                        .domain([0, d3.max(data, function(d) { return +d.Present}) ]);
            yAxis.transition().duration(duration).call(d3.axisLeft(yScale));
            
            //Appending the axis labels to the svg
            svg.append('text').attr('x', -300).attr('y', 40)
                            .attr('transform','rotate(-90)').text("Number of Recorded Attendance")
                            .attr("font-size",17).attr('font-weight','bold');
            svg.append('text').attr('transform','translate('+(width/2)+', '+(innerHeight + margin.bottom + 10)+')')
                            .text("Weeks").attr("font-size",17).attr('font-weight','bold');

            //Appending the rectangles to the group element               
            grp.selectAll("rect")
                .data(data)
                .join('rect')
                .attr("x", function(d) { return xScale(d.Week); })
                .attr("y", function(d) { return yScale(d[yStatus]); })
                .attr("width", xScale.bandwidth())
                .attr("height", function(d) { return innerHeight - yScale(d[yStatus]); })
        
             //Creating the mouseover events   
            .on('mouseover', function(event, d, i){
                tooltip.html(`<div>${d[yStatus]}</div>`)
                    .style('visibility', 'visible')
                d3.select(this).style('opacity', 0.5)
            })
            .on('mousemove', function(event){
                    tooltip.style('left', event.pageX + 10 +'px')
                    .style('top', (event.pageY) + 10 +'px')
            })
            .on('mouseout', function(){
                tooltip.html(``).style('visibility', 'hidden')
                d3.select(this).style('opacity', 1)  
            })     
        })
         }
        //Chart initialises with present values
        chart('Present')