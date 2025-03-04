/**
 * Settles all debts between members of an apartment who are splitting a set of costs equally. This algorithm
 * works for an arbitrarily large number of people, finding the most optimal set of payments to occur such that:
 *   (1) if person A owes person B and vice versa, only the one who owes more will make a payment
 *   (2) if person A owes person B and person B owes person C, A will directly pay C, and B will pay less to C
 * 
 * @param {Array<String>} allNames the list of everyone living in the apartment splitting costs equally
 * @param {Array<Object>} allPayments a list of jsons containing { spender: __, value: __ } for every payment made
 */
function settleDebts(allNames, allPayments) {
    // step 0: init data structures
    const N = allNames.length
    let debtMatrix = []
    for (let i = 0; i < N; i++) {
        debtMatrix.push(new Array(N).fill(0))
    }

    let nameToIdx = new Map()
    allNames.forEach((name, idx) => nameToIdx[name] = idx)
    
    // step 1: insert every payment into matrix
    allPayments.forEach((payment) => {
        let idx = nameToIdx[payment.spender]
        let amtOwed = payment.value / N

        for (let i = 0; i < N; i++) {
            // skip ourselves
            if (i == idx) {
                continue
            }

            // otherwise, log that this other person owes person "idx" money
            debtMatrix[i][idx] += amtOwed
        }
    })

    // step 2:
    console.log(debtMatrix)
}

settleDebts(["H", "A", "V"], [{spender: "H", value: 12}, {spender: "A", value: 18}, {spender: "V", value: 36}])