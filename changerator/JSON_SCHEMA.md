<!--
Copyright 2026 Princess Beef Heavy Industries, LLC / Dave Shanley
SPDX-License-Identifier: Apache-2.0
-->

# JSON Schema comparisons

Pass two parsed Draft 2020-12 schemas to `CompareJSONSchema`. The native libopenapi comparator identifies changes to the authored resources. Doctor connects each change to its location in the source tree and renders it with the existing Markdown, HTML, and terminal renderers.

```go
result, err := changerator.CompareJSONSchema(original, modified, rules)
if err != nil {
    return err
}
if result == nil {
    return nil // the comparison found no changes
}
defer result.Release()

markdown, err := result.Changerator.GenerateReport(
    renderer.NewMarkdownRenderer(), renderer.OutputFormatMarkdown,
)
```

Load each input with `jsonschema.Load` in `github.com/pb33f/libopenapi/jsonschema`. The caller owns the parsed inputs and releases them after the comparison and its viewers finish.

For a collection, pass the bytes for each snapshot member to `jsonschema.LoadCollection`. The keys are slash-separated paths relative to the snapshot directory. Pass the resulting two documents to the same comparison function. A collection has a `Schemas` document node. Each physical file appears below it. Named embedded resources retain their place in the authored tree.

Each change includes the owning `SchemaResource` and a JSONPath relative to that resource. `Change.Context` carries line and column coordinates and the matching source name for each available side. A deletion points to the original file. A reference points to a single definition node, including for recursive schemas. The complete graph keeps the root's authored label and uses `root` as its node ID.

Collection graph IDs include the resource identity. A member can move between files and retain its graph ID. The node's `nodePath` is an RFC 6901 pointer into its physical source. An explorer can call `PrepareChangeViewGraph` on a copy of the tree and supply the comparison's `ChangedEdges`. The resulting nodes include each incoming reference site and its ancestors. Only the defining node owns the edit.
