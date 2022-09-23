// Create function to plot the data (Bar, gauge, bubble)
function getPlot(id) {
    // obtain data from json file
    d3.json("../Data/samples.json").then((data)=> {
        console.log(data)
  
        let wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // filter sample values by id 
        let samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // get the top 10 
        let samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // get only top 10 otu ids for the plot OTU and reverse it. 
       let OTU_top_10 = (samples.otu_ids.slice(0, 10)).reverse();
        
        // get the otu id's to the desired form for the plot
       let OTU_id = OTU_top_10.map(d => "OTU " + d)
  
      //   console.log(`OTU IDS: ${OTU_id}`)
  
  
        // get the top 10 labels for the plot
        let labels = samples.otu_labels.slice(0, 10);
  

        // create trace variable for the plot
       let trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'blue'},
            type:"bar",
            orientation: "h",
        };
  

        data = [trace];
  
        // create layout variable to set plots layout
        let layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 50
            }
        };
  
        // create  bar plot
        Plotly.newPlot("bar", data, layout);
  
       
      
        // create bubble chart
        let trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // set the layout for the bubble plot
        let layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // creating data variable 
        let data1 = [trace1];
  
        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // The guage chart
  
        let data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Belly Button Washing Frequency (scrub per week) ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "red" },
                    { range: [2, 4], color: "blue" },
                    { range: [4, 6], color: "yllow" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                  ]}
              
          }
        ];
        let layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  
// create the function to get the necessary data
function getInfo(id) {
    // read the json file to get data
    d3.json("../Data/samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
       let metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id
       let result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
       let demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    let dropdown = d3.select("#selDataset");

    // read data 
    d3.json("../Data/samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call and display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();