function lifecycle(initialState, cycles) {
    // avoid invalid inputs
    if (!initialState || !cycles || !Array.isArray(initialState) || !Number.isInteger(cycles)) {
        throw new Error("invalid input parameter");
    }

    // checks that we are using a proper cells array
    const isValid = initialState.every(cell => [0, 1].includes(cell));

    if (!isValid) {
        throw new Error("Cells array is not valid")
    }

    let finalState = [...initialState]

    for (i = 0; i < cycles; i++) {
        finalState = finalState.map((cell, index, array) => {
            // previous cell is the last of the array if this is the first cell (cyclic sequence)
            const previous = index === 0 ? array[array.length - 1] : array[index - 1];
            // next cell is the first of the array if this is the last cell (cyclic sequence)
            const next = index === array.length - 1 ? array[0] : array[index + 1];


            // if both neighbors are excited, return to quiet state
            if (previous === 1 && next === 1) {
                return 0;
            }

            // if both neighbors are quiet, return to quiet
            if (previous === 0 && next === 0) {
                return 0
            }

            // else, one of the neighbors is excited, transition to excited
            return 1;
        })
    }

    return finalState.join(",");
}


const tests = [{
    label: "it should throw if initialState is invalid",
    initialState: {},
    cycles: 1,
    finalState: "invalid input parameter"
},
{
    label: "it should throw if cycles are invalid",
    initialState: [0, 1, 0],
    cycles: "somehting",
    finalState: "invalid input parameter"
},
{
    label: "it should throw if initalState contains invalid cells",
    initialState: [0, 1, 0, 'stuff'],
    cycles: 5,
    finalState: "Cells array is not valid"
},
{
    label: "it should throw if cycles is 0",
    initialState: [0, 1, 0],
    cycles: 0,
    finalState: "invalid input parameter"
},
{
    label: "it should work for the most basic of setups",
    initialState: [0],
    cycles: 1,
    finalState: "0"
},
{
    label: "it should match the given example case",
    initialState: [1, 1, 0, 1],
    cycles: 2,
    finalState: "0,0,0,0"
},
{
    label: "it should properly turn cells to 1 when only one of the neighbor cells was 1 at the previous cycle",
    initialState: [0, 0, 1, 1],
    cycles: 1,
    finalState: "1,1,1,1"
},
{
    label: "it should properly turn cells to 0 when both neighbor cells were 1 at the previous cycle",
    initialState: [1, 1, 1, 1],
    cycles: 1,
    finalState: "0,0,0,0"
},
{
    label: "it should stay constant if all cells are 0",
    initialState: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    cycles: 10,
    finalState: "0,0,0,0,0,0,0,0,0"
}
]

tests.forEach(test => {
    let result;

    try {
        result = lifecycle(test.initialState, test.cycles);
    } catch (error) {
        result = error.message;
    }

    console.log(test.label)
    if (result === test.finalState) {
        console.log("OK\n")
    } else {
        console.error("FAIL");
        console.log(`got ${result} - expected ${test.finalState}\n`)
    }
})
