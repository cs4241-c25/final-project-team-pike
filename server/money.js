/**
 * Settles all debts between members of an apartment who are splitting a set of costs equally. This algorithm
 * works for an arbitrarily large number of people, finding the most optimal set of payments to occur such that:
 *   (1) if person A owes person B and vice versa, only the one who owes more will make a payment
 *   (2) if person A owes person B and person B owes person C, A will directly pay C, and B will pay less to C
 * 
 * @param {Array<String>} allNames the list of everyone living in the apartment splitting costs equally
 * @param {Array<Object>} allPayments a list of jsons containing { spender: __, value: __ } for every payment made
 */
export default function settleDebts(allNames, allPayments) {
    // step 0: init data structures
    const N = allNames.length
    let debtMatrix = [] // debtMatrix[personA][personB] is the amt A owes B
    for (let i = 0; i < N; i++) {
        debtMatrix.push(new Array(N).fill(0))
    }

    let nameToIdx = new Map()
    allNames.forEach((name, idx) => nameToIdx[name] = idx)
    
    // step 1: insert every payment into matrix
    allPayments.forEach((payment) => {
        let owedIdx = nameToIdx[payment.spender]
        let amtOwed = payment.value / N

        for (let i = 0; i < N; i++) {
            // skip ourselves
            if (i == owedIdx) {
                continue
            }

            // otherwise, log that this other person owes person "idx" money
            debtMatrix[i][owedIdx] += amtOwed
        }
    })

    // step 2: find out who owes money, who is owed money, and remove unnecessary transactions
    let owes = new Map()
    let owed = new Map()
    for (let i = 0; i < N; i++) {
        // find out how much this person owes and how much they're owed
        let totalOwes = 0
        let totalOwed = 0
        for (let j = 0; j < N; j++) {
            totalOwes += debtMatrix[i][j]
            totalOwed += debtMatrix[j][i]
        }

        // remove the unnecessary transaction (if they're equal, no transaction added)
        if (gt(totalOwed, totalOwes)) {
            owed[allNames[i]] = totalOwed - totalOwes
        } else if (lt(totalOwed, totalOwes)) {
            owes[allNames[i]] = totalOwes - totalOwed
        }
    }

    // step 3: find most optimal pairing of who pays who (least num payments)
    return optimizePayments(owes, owed)
}

/**
 * Generates a list of payments given who in a group is owed money and who in the group owes money. Uses
 * a dynamic programming algorithm to determine the least number of payments required to settle all debts. 
 * 
 * @param {Map} owes a map of everyone who owes money, and how much they owe
 * @param {Map} owed a map of everyone who is owed money, and how much they're owed
 * @returns a list of payments that successfully pays everyone off with the minimum number of payments possible
 */
function optimizePayments(owes, owed) {
    // to cache known states to number of steps until everyone is paid off
    const memo = new Map() 
    
    function dp(state, pathSoFar) {
        // check for final state
        if (Object.values(state[0]).every(val => eq(val, 0))) {
            return pathSoFar
        }
        
        // check if this state has been memoized
        const key = stateKey(state)
        if (memo.has(key)) {
            return memo.get(key)
        }
        
        // generate all possible payment transitions
        let minPaymentsPath = null
        const [currOwes, currOwed] = state
        for (const [payer, oweAmount] of Object.entries(currOwes)) {
            // skip people who're already zero
            if (eq(oweAmount, 0)) {
                continue;
            }
            
            for (const [payee, owedAmount] of Object.entries(currOwed)) {
                // skip people who're already zero
                if (eq(owedAmount, 0)) {
                    continue;
                }
                
                // calculate payment between payer and payee
                const paidAmount = Math.min(oweAmount, owedAmount)
                
                // deep copy old state and create new state
                const newOwes = {...currOwes}
                const newOwed = {...currOwed}
                newOwes[payer] -= paidAmount
                newOwed[payee] -= paidAmount
                const newState = [newOwes, newOwed]
                
                // same but for current path
                const newPath = [...pathSoFar]
                newPath.push({from: payer, to: payee, amount: Math.round(paidAmount * 100) / 100})
                
                // recursively calculate the min payment path and update most optimal path
                const result = dp(newState, newPath)
                if (minPaymentsPath == null || result.length < minPaymentsPath.length) {
                    minPaymentsPath = result
                }
            }
        }
        
        // cache this state's result
        memo.set(key, minPaymentsPath)
        return minPaymentsPath
    }
    
    // generate a unique string key from an object
    function stateKey(state) {
        return JSON.stringify(state)
    }
    
    // create initial conditions and start dynamic programming
    let initialState = [owes, owed]
    return dp(initialState, [])
}

// helper functions to deal with floating point arithmetic
const EPS = 1e-5
function gt(float1, float2) { return float1 - float2 > EPS }
function lt(float1, float2) { return float1 - float2 < -EPS }
function eq(float1, float2) { return float1 - float2 < EPS }