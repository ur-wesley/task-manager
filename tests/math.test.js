const { calcTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('calc tip with own percentage', () => {
    const total = calcTip(10, .3)
    expect(total).toBe(13)
})

test('should calculate total with default tip', () => {
    const total = calcTip(10)
    expect(total).toBe(12)
})

test('Celsius to Fahrenheit', () => {
    const temp = celsiusToFahrenheit(0)
    expect(temp).toBe(32)
})

test('Fahrenheit to Celsius', () => {
    const temp = fahrenheitToCelsius(32)
    expect(temp).toBe(0)
})

// test('async test demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2)
//         done()
//     }, 2000)
// })

test('add function', (done) => {
    add(5, 6).then((sum) => {
        expect(sum).toBe(11)
        done()
    })
})

test('add function async await', async () => {
    const sum = await add(5, 6)
    expect(sum).toBe(11)
})