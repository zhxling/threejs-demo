class quickSort {
    quickSort1(arr) {
        if (arr.length <= 1) {
            return arr;
        }

        let pivotIndex = Math.floor(arr.length / 2);
        let pivot = arr[pivotIndex];
        let left = [];
        let right = [];
        for (let i = 0; i < arr.length; i++) {
            if (i === pivotIndex) {
                continue;
            }

            if (arr[i] <= pivot) {
                left.push(arr[i]);
            }

            if (arr[i] > pivot) {
                right.push(arr[i])
            }
        }

        return this.quickSort1(left).concat([pivot], this.quickSort1(right));
    }

    quickSort2(arr) {
        function sort(prev, numSize) {
            let nonius = prev;
            let j = numSize - 1;
            let flag = arr[prev];

            if (numSize - prev > 1) {
                while (nonius < j) {
                    for (; nonius < j; j--) {
                        if (arr[j] < flag) {
                            arr[nonius++] = arr[j];
                            break;
                        }
                    }

                    for (; nonius < j; nonius++) {
                        if (arr[nonius] > flag) {
                            arr[j--] = arr[nonius];
                            break;
                        }
                    }
                }

                arr[nonius] = flag;
                sort(0, nonius);
                sort(nonius + 1, numSize);
            }
        }

        sort(0, arr.length);
        return arr;
    }
}

quickSort.$inject = [];

export default quickSort;
