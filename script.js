const arrayContainer = document.getElementById('array-container');
const algorithmTitle = document.getElementById('algorithmTitle');
const complexity = document.getElementById('complexity');
const arraySizeDisplay = document.getElementById('arraySizeDisplay');

let array = [];
let arraySize = 50;
let selectedAlgorithm = 'bubbleSort';
let isSorting = false;
let speed = 0;

function createArray(size = 50) {
    array = [];
    for (let i = 0; i < size; i++) {
        //array.push(Math.floor(Math.random() * 100) + 1);
        array.push(i + 1);
    }
    array.sort(() => Math.random() - 0.5);
    displayArray();
}

function displayArray() {
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`;
        arrayContainer.appendChild(bar);
    });
}

function updateAlgorithm() {
    selectedAlgorithm = document.getElementById('algorithm').value;
    algorithmTitle.textContent = selectedAlgorithm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    updateComplexity();
}

function updateArraySize() {
    arraySize = document.getElementById('arraySize').value;
    arraySizeDisplay.textContent = `n=${arraySize}`;
    createArray(arraySize);
}

function updateSpeed() {
    speed = document.getElementById('speed').value;
}

function updateComplexity() {
    switch (selectedAlgorithm) {
        case 'bubbleSort':
        case 'selectionSort':
        case 'insertionSort':
            complexity.innerHTML = 'O(n<sup>2</sup>)';
            break;
        case 'mergeSort':
        case 'quickSort':
        case 'heapSort':
            complexity.innerHTML = 'O(n log n)';
            break;
        case 'shellSort':
            complexity.innerHTML = 'O(n (log n)<sup>2</sup>)';
            break;
        case 'radixSort':
            complexity.innerHTML = 'O(nk)';
            break;
        default:
            complexity.innerHTML = '';
            break;
    }
}

async function bubbleSort() {
    let bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].style.backgroundColor = 'white';
            bars[j + 1].style.backgroundColor = 'white';
            await sleep(speed);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                displayArray();
                bars = document.getElementsByClassName('bar');
            }
            bars[j].style.backgroundColor = 'green';
            bars[j + 1].style.backgroundColor = 'green';
        }
        bars[array.length - i - 1].style.backgroundColor = 'green';
    }
}

async function selectionSort() {
    let bars = document.getElementsByClassName('bar');
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[minIndex].style.backgroundColor = 'white';
        for (let j = i + 1; j < array.length; j++) {
            bars[j].style.backgroundColor = 'yellow';
            await sleep(speed);
            if (array[j] < array[minIndex]) {
                bars[minIndex].style.backgroundColor = 'green';
                minIndex = j;
                bars[minIndex].style.backgroundColor = 'white';
            } else {
                bars[j].style.backgroundColor = 'green';
            }
        }
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        displayArray();
        bars = document.getElementsByClassName('bar');
        bars[minIndex].style.backgroundColor = 'green';
        bars[i].style.backgroundColor = 'green';
    }
}

async function insertionSort() {
    let bars = document.getElementsByClassName('bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].style.backgroundColor = 'white';
        await sleep(speed);
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j = j - 1;
            displayArray();
            bars = document.getElementsByClassName('bar');
            bars[j + 1].style.backgroundColor = 'white';
            await sleep(speed);
        }
        array[j + 1] = key;
        displayArray();
        bars = document.getElementsByClassName('bar');
        bars[i].style.backgroundColor = 'green';
    }
}

async function mergeSort() {
    await mergeSortHelper(0, array.length - 1);
}

async function mergeSortHelper(left, right) {
    if (left >= right) return;

    const middle = Math.floor((left + right) / 2);
    await mergeSortHelper(left, middle);
    await mergeSortHelper(middle + 1, right);
    await merge(left, middle, right);
}

async function merge(left, middle, right) {
    let bars = document.getElementsByClassName('bar');
    let leftArray = array.slice(left, middle + 1);
    let rightArray = array.slice(middle + 1, right + 1);

    let i = 0, j = 0, k = left;

    while (i < leftArray.length && j < rightArray.length) {
        bars[k].style.backgroundColor = 'white';
        await sleep(speed);
        if (leftArray[i] <= rightArray[j]) {
            array[k] = leftArray[i];
            i++;
        } else {
            array[k] = rightArray[j];
            j++;
        }
        k++;
        displayArray();
        bars = document.getElementsByClassName('bar');
    }

    while (i < leftArray.length) {
        bars[k].style.backgroundColor = 'white';
        await sleep(speed);
        array[k] = leftArray[i];
        i++;
        k++;
        displayArray();
        bars = document.getElementsByClassName('bar');
    }

    while (j < rightArray.length) {
        bars[k].style.backgroundColor = 'white';
        await sleep(speed);
        array[k] = rightArray[j];
        j++;
        k++;
        displayArray();
        bars = document.getElementsByClassName('bar');
    }

    for (let i = left; i <= right; i++) {
        bars[i].style.backgroundColor = 'green';
    }
}

async function quickSort() {
    await quickSortHelper(0, array.length - 1);
}

async function quickSortHelper(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
    }
}

async function partition(low, high) {
    let bars = document.getElementsByClassName('bar');
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        bars[j].style.backgroundColor = 'white';
        await sleep(speed);
        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            displayArray();
            bars = document.getElementsByClassName('bar');
        }
        bars[j].style.backgroundColor = 'green';
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    displayArray();
    bars = document.getElementsByClassName('bar');
    bars[i + 1].style.backgroundColor = 'green';
    return i + 1;
}

async function heapSort() {
    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        displayArray();
        await sleep(speed);
        await heapify(i, 0);
    }
}

async function heapify(n, i) {
    let bars = document.getElementsByClassName('bar');
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest != i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        displayArray();
        bars = document.getElementsByClassName('bar');
        await sleep(speed);
        await heapify(n, largest);
    }
}

async function shellSort() {
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap];
                displayArray();
                let bars = document.getElementsByClassName('bar');
                bars[j].style.backgroundColor = 'white';
                await sleep(speed);
            }
            array[j] = temp;
            displayArray();
            let bars = document.getElementsByClassName('bar');
            bars[i].style.backgroundColor = 'green';
        }
    }
}

async function radixSort() {
    let max = Math.max(...array);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSort(exp);
    }
}

async function countingSort(exp) {
    let output = new Array(array.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < array.length; i++) {
        count[Math.floor(array[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = array.length - 1; i >= 0; i--) {
        output[count[Math.floor(array[i] / exp) % 10] - 1] = array[i];
        count[Math.floor(array[i] / exp) % 10]--;
    }

    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        displayArray();
        let bars = document.getElementsByClassName('bar');
        bars[i].style.backgroundColor = 'white';
        await sleep(speed);
    }

    let bars = document.getElementsByClassName('bar');
    for (let i = 0; i < bars.length; i++) {
        bars[i].style.backgroundColor = 'green';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function startSort() {
    if (isSorting) return;
    isSorting = true;
    updateSpeed();
    switch (selectedAlgorithm) {
        case 'bubbleSort':
            bubbleSort().then(() => isSorting = false);
            break;
        case 'selectionSort':
            selectionSort().then(() => isSorting = false);
            break;
        case 'insertionSort':
            insertionSort().then(() => isSorting = false);
            break;
        case 'mergeSort':
            mergeSort().then(() => isSorting = false);
            break;
        case 'quickSort':
            quickSort().then(() => isSorting = false);
            break;
        case 'heapSort':
            heapSort().then(() => isSorting = false);
            break;
        case 'shellSort':
            shellSort().then(() => isSorting = false);
            break;
        case 'radixSort':
            radixSort().then(() => isSorting = false);
            break;
    }
}

createArray(arraySize);
updateComplexity();
