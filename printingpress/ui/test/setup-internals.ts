// jsdom's ElementInternals lacks the form-validity methods and state Web Awesome's
// controls call while they update. The tests need none of them to work, so
// they are stubbed.
const original = HTMLElement.prototype.attachInternals;
HTMLElement.prototype.attachInternals = function attachInternals(this: HTMLElement) {
    const internals = (original ? original.call(this) : {}) as ElementInternals & Record<string, unknown> & {validity?: ValidityState; states?: CustomStateSet};
    for (const name of ['setValidity', 'setFormValue', 'checkValidity', 'reportValidity']) {
        if (typeof internals[name] !== 'function') {
            internals[name] = () => true;
        }
    }
    internals.validity ??= {valid: true} as ValidityState;
    internals.states ??= new Set<string>() as unknown as CustomStateSet;
    return internals;
};
