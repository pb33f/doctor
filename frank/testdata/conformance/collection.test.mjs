import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import schema from "@opencollection/schema/src/opencollection.schema.json" with {
	type: "json",
};
import Ajv from "ajv";
import addFormats from "ajv-formats";
import YAML from "yaml";

const collection = YAML.parse(readFileSync("../golden/bundled.yml", "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(schema, "oc");
const validateCollection = ajv.compile({ $ref: "oc" });
const validateAuth = ajv.compile({ $ref: "oc#/$defs/Auth" });
const validateBody = ajv.compile({ $ref: "oc#/$defs/HttpRequestBody" });

const requests = collection.items
	.flatMap((folder) => folder.items ?? [])
	.filter((item) => item.http);

test("every request's auth validates against the OpenCollection schema", () => {
	assert.deepEqual(violations(validateAuth, "auth"), []);
});

test("every request's body validates against the OpenCollection schema", () => {
	assert.deepEqual(violations(validateBody, "body"), []);
});

test("the collection validates against the OpenCollection schema", () => {
	assert.ok(
		validateCollection(collection),
		ajv.errorsText(validateCollection.errors, { dataVar: "collection" }),
	);
});

// The schema cannot see this one: any space-separated string is a valid scope.
// Only the fixture knows this operation declared a single scope.
test("oauth2 scope is the scope the operation declares", () => {
	const listItems = requests.find((r) => r.info.name === "List items");

	assert.equal(listItems.http.auth.scope, "inventory:read");
});

function violations(validate, field) {
	return requests
		.filter((r) => r.http[field] !== undefined)
		.flatMap((r) => {
			if (validate(r.http[field])) return [];
			const reasons = new Set(
				validate.errors
					.filter((e) => e.keyword !== "oneOf" && e.keyword !== "anyOf")
					.map((e) => {
						const at = e.instancePath ? `${e.instancePath} ` : "";
						const what =
							e.params?.additionalProperty ??
							e.params?.missingProperty ??
							e.params?.allowedValues?.join("|") ??
							"";
						return `${at}${e.message}${what ? ` (${what})` : ""}`;
					}),
			);
			return [`${r.info.name}: ${[...reasons].join("; ")}`];
		});
}
