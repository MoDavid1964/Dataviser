/**
 * @ Author: Mo David
 * @ Create Time: 2024-04-23 08:45:34
 * @ Modified time: 2024-04-28 18:33:59
 * @ Description:
 * 
 * Manages all the dataviser functionality.
 */

import './Dataviser.css'

import '../ui/Grid.component'
import '../ui/Input.component'
import '../ui/Button.component'
import '../ui/Slider.component'
import '../ui/Editor.component'

import { FileAPI } from './File.api'
import { DataviserPyAPI } from './Dataviser.pyapi'

import { Dataframe } from './Dataframe.class'
import { DatagraphManager } from './Datagraph.class'

// Handles all the data vis
export const Dataviser = (function() {
  
  const root = document.getElementsByClassName('root')[0];
  const dataviserWindow = document.createElement('grid-component');
  const dataviserCatalogue = document.createElement('grid-cell-component');
  const dataviserFileList = document.createElement('div');
  const dataviserInfoBoard = document.createElement('div');
  
  const _ = {
    dfs: {},
  };

  // ! put this guy elsewhere
  const keyParser = key => {
    return {
      date: new Date(key).getTime(),
    }
  }

  // Dataviser menu elements
  dataviserCatalogue.classList.add('dataviser-catalogue');
  dataviserFileList.classList.add('dataviser-file-list');
  dataviserInfoBoard.classList.add('dataviser-info-board');

  // The input fields
  const inputRangeField = document.createElement('input-component');
  const inputIsolateField = document.createElement('input-component');
  
  /**
   * Update this so it doesnt become messy over time
   */
  _.init = function() {
    
    // Create the title and import button
    const importButton = document.createElement('button-component');
    importButton.innerHTML = 'select folder';
    importButton.classList.add('dataviser-import-button');
    importButton.mouseDownCallback = e => {
      _.selectDirectory();
    }

    // The catalogue of graphs
    dataviserWindow.appendCell(3, 1, 3, 4);
    dataviserWindow.getCell(3, 1).classList.add('dataviser-catalogue');

    // The title
    dataviserWindow.appendCell(1, 1);
    dataviserWindow.getCell(1, 1).classList.add('dataviser-title');
    dataviserWindow.getCell(1, 1).append('Dataviser');
    
    // Import button
    dataviserWindow.appendCell(1, 2);
    dataviserWindow.getCell(1, 2).appendChild(importButton);
    
    // File list
    dataviserWindow.appendCell(2, 2);
    dataviserWindow.getCell(2, 2).appendChild(dataviserFileList);
    
    // Input fields
    dataviserWindow.appendCell(1, 3);
    dataviserWindow.getCell(1, 3).append('date filter (heatmaps):');
    dataviserWindow.getCell(1, 3).appendChild(inputRangeField);
    dataviserWindow.getCell(1, 3).append('name filter (series):');
    dataviserWindow.getCell(1, 3).appendChild(inputIsolateField);
    
    // Info board
    dataviserWindow.appendCell(2, 4, 1, 2);
    dataviserWindow.getCell(2, 4).appendChild(dataviserInfoBoard);

    // Some code samples
    // !remove
    const test = document.createElement('editor-component');
    document.body.append(test)

    dataviserWindow.appendCell(3, 4, 1, 1);
    dataviserWindow.getCell(3, 4).appendChild(test);

    // Populate the fields
    inputRangeField.innerHTML = '2020-01-01, 2021-01-01';
    inputIsolateField.innerHTML = 'type location name here';

    // Append everything to the window
    root.appendChild(dataviserWindow);

    // ! remove
    const d = DatagraphManager.create('test', { '1': { '1': '10', '2': '20' }, '2': { '1': '30', '2': '50' }}, { parent: dataviserWindow.getCell(3, 1) });
    const dgraph = DatagraphManager.get(d);

    setTimeout(() => {
      dgraph.init();
      dgraph.addXAxis({ domain: [0, 1000] })
      dgraph.addYAxis({ domain: [0, 1000] })
      dgraph.drawXAxis()
      dgraph.drawYAxis()
      dgraph.drawTitle()
    })
  }

  /**
   * Configures the dataset object.
   */
  _.configData = function() {

    // ! use these function to pass data to d3
    // /**
    //  * Parses the raw data and converts into a 2d matrix.
    //  * 
    //  * // ! store min and max!
    //  */
    // dataset.addParser('matrix', (asset, options={}) => {

    //   // Clone the object first
    //   asset = structuredClone(asset);

    //   // We define a matrix
    //   let m = [];
    //   m.labels = [];
        
    //   // Build up the matrix
    //   for(let row in asset) {
    //     let mrow = [];
        
    //     for(let entry in asset[row])
    //       mrow.push(asset[row][entry]);

    //     // Push the new row and the label
    //     m.push(mrow);
    //     m.labels.push(row);
    //   }

    //   return m;
    // });

    // /**
    //  * This parser converts the raw data into a 2x2 matrix
    //  * However, it only gets data from the n most significant parties
    //  */
    // dataset.addParser('matrix-reduced', (asset, options={}) => {

    //   // Clone the object first
    //   asset = structuredClone(asset);

    //   // We define a matrix
    //   let m = [];
    //   let sums = [];
    //   m.labels = [];

    //   // Max count
    //   const maxCount = options.maxCount ?? 16;
  
    //   // Generate sums per row and column
    //   for(let row in asset) {
    //     let sum = 0;
        
    //     // Add the row and columns
    //     for(let entry in asset[row])
    //       sum += asset[row][entry] + (entry != row ? asset[entry][row] : 0);
    //     sums.push([row, sum]);
    //   }

    //   // Sort sums by size
    //   sums.sort((a, b) => b[1] - a[1]);

    //   // There's nothing
    //   if(!sums.length) return m;
      
    //   let i = 0;
    //   let sumDict = {};
    //   let cumRow = sums[maxCount][0];

    //   // Save the top sums
    //   for(i = 0; i < maxCount + 1 && i < sums.length; i++)
    //     sumDict[sums[i][0]] = true;  

    //   for(let row in asset) {
    //     for(let entry in asset[row]) {

    //       // Accumulate the rest on the cumRow
    //       if(!sumDict[row]) {
    //         if(!sumDict[entry])
    //           asset[cumRow][cumRow] += asset[row][entry];
    //         else
    //           asset[cumRow][entry] += asset[row][entry];
    //       } else {
    //         if(!sumDict[entry])
    //           asset[row][cumRow] += asset[row][entry];
    //       }

    //       // Set to 0 if unimportant
    //       if(!sumDict[row] || !sumDict[entry]) {
    //         asset[row][entry] = 0;
    //         asset[entry][row] = 0;
    //       }
    //     }
    //   }

    //   // Delete the unneeded rowsand columns
    //   for(let row in asset) {
    //     for(let entry in asset[row])
    //       if(!sumDict[entry])
    //         delete asset[row][entry];

    //     if(!sumDict[row])
    //       delete asset[row];
    //   }

    //   // Accumulate the sum too
    //   for(let i = maxCount + 1; i < sums.length; i++)
    //     sums[maxCount][1] += sums[i][1];

    //   // Truncate the sums
    //   sums = sums.slice(0, maxCount + 1);

    //   // Build up the matrix
    //   for(let row in asset) {
    //     let mrow = [];
        
    //     for(let entry in asset[row])
    //       mrow.push(asset[row][entry]);

    //     // Push the new row and the label
    //     m.push(mrow);
    //     m.labels.push(row);
    //   }

    //   // Change last label
    //   m.labels[m.labels.length - 1] = 'other';

    //   return m;
    // });

    // /**
    //  * This parser converts the raw data into a list of associations
    //  * ! makr sure to store min and max
    //  */
    // dataset.addParser('relation', (asset, options={}) => {

    //   // Clone the object first
    //   asset = structuredClone(asset);

    //   // We define a list
    //   let m = [];
    //   m.labels = [];
        
    //   // Build up the relation
    //   for(let row in asset) {   
        
    //     // Push each of the relationships
    //     for(let entry in asset[row]) {
    //       m.push({
    //         x: entry,
    //         y: row,
    //         value: asset[row][entry]
    //       });
    //     }

    //     // Save the entry label
    //     m.labels.push(row);
    //   }

    //   return m;
    // });

    // /**
    //  * This parser converts the raw data into a list of associations
    //  * However, it only gets data points from the n most significant parties
    //  */
    // dataset.addParser('relation-reduced', (asset, options={}) => {

    //   // Clone the object first
    //   asset = structuredClone(asset);

    //   // We define a list
    //   let m = [];
    //   let sums = [];
    //   m.labels = [];
    //   m.min = Number.POSITIVE_INFINITY;
    //   m.max = Number.NEGATIVE_INFINITY;

    //   // Max count
    //   const maxCount = options.maxCount ?? 16;
        
    //   // Generate sums per row and column
    //   for(let row in asset) {
    //     let sum = 0;
        
    //     // Add the row and columns
    //     for(let entry in asset[row])
    //       sum += asset[row][entry] + (entry != row ? asset[entry][row] : 0);
    //     sums.push([row, sum]);
    //   }

    //   // Sort sums by size
    //   sums.sort((a, b) => b[1] - a[1]);

    //   // There's nothing
    //   if(!sums.length) return m;
      
    //   let i = 0;
    //   let sumDict = {};
    //   let cumRow = sums[maxCount][0];

    //   // Save the top sums
    //   for(i = 0; i < maxCount + 1 && i < sums.length; i++)
    //     sumDict[sums[i][0]] = true;  

    //   for(let row in asset) {
    //     for(let entry in asset[row]) {

    //       // Accumulate the rest on the cumRow
    //       if(!sumDict[row]) {
    //         if(!sumDict[entry])
    //           asset[cumRow][cumRow] += asset[row][entry];
    //         else
    //           asset[cumRow][entry] += asset[row][entry];
    //       } else {
    //         if(!sumDict[entry])
    //           asset[row][cumRow] += asset[row][entry];
    //       }

    //       // Set to 0 if unimportant
    //       if(!sumDict[row] || !sumDict[entry])
    //         asset[row][entry] = 0;
    //     }
    //   }

    //   // Accumulate the sum too
    //   for(let i = maxCount + 1; i < sums.length; i++)
    //     sums[maxCount][1] += sums[i][1];

    //   // Truncate the sums
    //   sums = sums.slice(0, maxCount + 1);

    //   // Get only the 20 most prominent locations
    //   for(i = 0; i < sums.length; i++) { 
    //     let row = sums[i][0];
        
    //     // Push each of the relationships
    //     for(let entry in asset[row]) {
          
    //       // It;s a 0 we don't need
    //       if(!sumDict[entry])
    //         continue;

    //       m.push({
    //         x: entry == cumRow ? 'other' : entry,
    //         y: row == cumRow ? 'other' : row,
    //         value: asset[row][entry]
    //       });

    //       if(m.min > asset[row][entry]) m.min = asset[row][entry]
    //       if(m.max < asset[row][entry]) m.max = asset[row][entry]

    //       // Compute this too
    //       if(row != entry) {
    //         m.push({
    //           x: entry == cumRow ? 'other' : entry,
    //           y: row == cumRow ? 'other' : row,
    //           value: asset[entry][row]
    //         });
    //       }
    //     }

    //     // Save the entry label
    //     m.labels.push(row);
    //   }

    //   // Change last label
    //   m.labels[m.labels.length - 1] = 'other';

    //   return m;
    // });

    // /**
    //  * Parses series data into something we can print
    //  */
    // dataset.addParser('series-list', (series, options={}) => {
      
    //   // Duplicate so we don't accidentally modify it
    //   series = structuredClone(series);

    //   // The list and the keys
    //   const list = [];
    //   const seriesKeys = Object.keys(series);

    //   // Define maxima
    //   list.min = Number.POSITIVE_INFINITY;
    //   list.max = Number.NEGATIVE_INFINITY;

    //   for(let i = 0; i < seriesKeys.length; i++) {
    //     let sum = 0;
    //     let seriesEntryKeys = Object.keys(series[seriesKeys[i]]);
        
    //     for(let j = 0; j < seriesEntryKeys.length; j++)
    //       if(!isNaN(parseInt(series[seriesKeys[i]][seriesEntryKeys[j]])))
    //         sum += parseInt(series[seriesKeys[i]][seriesEntryKeys[j]]);

    //     list.push({
    //       x: new Date(parseInt(series[seriesKeys[i]].metadata.startDate)),
    //       y: sum,
    //     })

    //     if(list.min > sum) list.min = sum;
    //     if(list.max < sum) list.max = sum;
    //   }

    //   return list;

    // }, 'series');

  }

  /**
   * Renders the data in a visually-pleasing way.
   */
  _.renderData = function() {

  }

  /**
   * Selects a directory for the user.
   * This function reads all the JSON files within a directory and stores them as is within our JS object.
   */
  _.selectDirectory = function() {

    // ! remove later
    const dfs = {};
    
    // Let the user pick a directory
    showDirectoryPicker({ id: 'default', mode: 'read' })

      // After selecting a folder
      // ! make sure to use readPickles instead!
      .then(directoryHandle => 
        FileAPI.getDirectoryFiles(directoryHandle, 
          files => files.forEach(
            file => FileAPI.readBinaryFile(file, 
              blob => DataviserPyAPI.readPickle(blob, d => {dfs[file.name.split('.')[0]] = d;})))))

      // Catch any errors
      .catch(error => {
        alert(`Error: \n(${error})`)
      })

      setTimeout(() => {
        console.log(Object.keys(dfs).length, dfs)
        console.log(DataviserPyAPI.dfsConcat(dfs, 
          df => console.log(df)));
      }, 10000);
  }

  return {
    ..._,
  }
})();

export default {
  Dataviser
}