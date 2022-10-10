const { set } = require("mongoose");

test('Test sample', () => {
    expect(1).not.toBe(2);
})
test('Test sample', (done) => {
    setTimeout(() => {
        expect(1).toBe(2);
        done()
    }, 2000)
})