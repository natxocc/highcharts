const csvData = document.getElementById('csv').innerHTML;

// Set to true to use the Invert modifier,
// otherwise flip table using beforeParse
const useInvertMod = true;

const chainModifier = {
    type: 'Chain',
    chain: [{
        type: 'Invert'
    }, {
        type: 'Range',
        ranges: [{
            column: 'x',
            minValue: 1961,
            maxValue: 2021
        }]
    }]
};


const rangeModifier = {
    type: 'Range',
    ranges: [{
        column: 'x',
        minValue: 1961,
        maxValue: 2021
    }]
};

const dataModifier = useInvertMod ? chainModifier : rangeModifier;


function getColumnAssignment(columnNames) {
    return columnNames.map(function (column) {
        return {
            seriesId: column,
            data: ['x', column]
        };
    });
}

Highcharts.setOptions({
    chart: {
        type: 'line'
    },
    yAxis: {
        max: 5,
        min: -1
    },
    xAxis: {
        min: 1960,
        max: 2022
    },
    tooltip: {
        pointFormat: '{series.name} had <b>{point.y:,.2f}%</b><br/> ' +
            'population growth in {point.x}'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            marker: {
                enabled: false
            }
        }
    }
});

const asiaChart = {
    renderTo: 'asia-chart',
    connector: {
        id: 'population-growth',
        columnAssignment: getColumnAssignment(
            ['China', 'Japan', 'India', 'Indonesia']
        )
    },
    type: 'Highcharts',
    chartOptions: {
        title: {
            text: 'Asia'
        }
    }
};

const northAmericaChart = {
    renderTo: 'north-america-chart',
    connector: {
        id: 'population-growth',
        columnAssignment: getColumnAssignment(
            ['Mexico', 'Guatemala', 'Canada', 'United States']
        )
    },
    type: 'Highcharts',
    chartOptions: {
        title: {
            text: 'North America'
        }
    }
};

const southAmericaChart = {
    renderTo: 'south-america-chart',
    connector: {
        id: 'population-growth',
        columnAssignment: getColumnAssignment(
            ['Brazil', 'Argentina', 'Uruguay', 'Paraguay']
        )
    },
    type: 'Highcharts',
    chartOptions: {
        title: {
            text: 'South America'
        }
    }
};

const legendChart = {
    renderTo: 'legend',
    connector: {
        id: 'population-growth'
    },
    type: 'Highcharts',
    columnAssignment: {
        Brazil: 'y',
        Argentina: 'y',
        Uruguay: 'y',
        Paraguay: 'y',
        'United States': 'y',
        Canada: 'y',
        Mexico: 'y',
        Guatemala: 'y',
        China: 'y',
        Japan: 'y',
        India: 'y',
        Indonesia: 'y'
    },
    chartOptions: {
        chart: {
            height: 200
        },
        title: {
            text: 'Countries population growth by year'
        },
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                lineWidth: 0,
                states: {
                    hover: {
                        enabled: false
                    }
                },
                marker: {
                    enabled: false
                }
            }
        },
        legend: {
            enabled: true,
            verticalAlign: 'middle',
            width: 1000,
            align: 'center',
            visible: false
        },
        xAxis: {
            width: 0,
            visible: false
        },
        yAxis: {
            height: 0,
            visible: false
        }
    }
};

Dashboards.board('container', {
    dataPool: {
        connectors: [{
            id: 'population-growth',
            type: 'CSV',
            options: {
                csv: csvData,
                firstRowAsNames: true,
                beforeParse: function (csv) {
                    if (useInvertMod) {
                        // Flip table using InvertModifier
                        return csv.replace(/Country Name/g, 'x');
                    }

                    // Convert rows to columns and throw away empty rows
                    const rows = csv.split('\n');
                    const columns = [];

                    rows.forEach((row, i) => {
                        if (!row) {
                            return;
                        }
                        console.log('row', i);
                        const values = row.split(',');
                        // Replace name of first column: "Country Name" -> x
                        if (i === 0) {
                            values[0] = 'x';
                        }
                        values.forEach((value, j) => {
                            if (!columns[j]) {
                                columns[j] = [];
                            }
                            columns[j][i] = value;
                        });
                    });
                    return columns.map(column => column.join(',')).join('\n');
                },
                dataModifier: dataModifier
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'south-america-chart'
                }, {
                    id: 'north-america-chart'
                }, {
                    id: 'asia-chart'
                }]
            }, {
                cells: [{
                    id: 'legend'
                }]
            }]
        }]
    },
    components: [
        asiaChart,
        northAmericaChart,
        southAmericaChart,
        legendChart
    ]
}, true);
