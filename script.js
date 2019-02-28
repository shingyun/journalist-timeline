
let plot = d3.select('#plot').append('svg')
    .attr('id','plot-svg')
    .style('width',1200)
    .style('height',900)
    .append('g')
    .attr('transform','translate(0,0)');

let scaleY = d3.scaleLinear()
	.domain([1992,2018])
	.range([100,700]);

let scaleX = d3.scaleBand()
    .range([150,1200]);

let scaleR = d3.scaleLinear()
    .domain([1,15])
    .range([2.5,50])

let death = [];


Promise.all([

    d3.csv('data/data.csv', function(d) {
		return {
	       year: +d['year'],
	       name: d['fullName'],
	       from: d['primaryNationality'],
	       country: d['country'],
	       type: d['typeOfDeath']
		}
    })

]).then(function(data) {

	death = d3.nest()
	        .key(d => d.year)
	        .key(d => d.country)
	        .rollup(e => e.length)
	        .entries(data[0])

	console.log(death);

    let countrylist = d3.nest()
            .key(d => d.country)
            .entries(data[0])

    countrylist = countrylist.map(d => d.key) 
    
    scaleX.domain(countrylist);

    console.log(countrylist)

    years = plot.selectAll('.year')
        .data(death)
        .enter()
        .append('g')
        .attr('class','year')
        .attr('id', d => {
        	return 'year_' + d.key;
        })
        .attr('transform', d => {
        	return 'translate(0,' + scaleY(d.key) + ')' 
        })

    years.selectAll('.country')
         .data(d => {return d.values})
         .enter()
         .append('circle')
         .attr('class','country')
         .attr('transform', function(d){
        	console.log(d.key)
        	return 'translate('+ scaleX(d.key) +',0)' 
         }) 
         .attr('r', d => scaleR(Math.sqrt(d.value)));

})






