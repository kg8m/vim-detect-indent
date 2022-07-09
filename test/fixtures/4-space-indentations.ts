if (returnsTrue()) {
    console.log("foo");
}

if (returnsTrue()) {
    if (returnsTrue()) {
        console.log("bar");
        console.log("baz");
    }
}

console.log("foobar");

function returnsTrue(): boolean {
    return true;
}
