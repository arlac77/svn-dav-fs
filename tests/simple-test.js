import test from "ava";
import { SVNHTTPSScheme } from "../src/svn";

const credentials = {
  password: "xxx",
  user: "yyy"
};

if (process.env.SVN_USER) {
  credentials.user = process.env.SVN_USER;
}

if (process.env.SVN_PASSWORD) {
  credentials.password = process.env.SVN_PASSWORD;
}

const OPTIONS = {
  proxy: process.env.HTTP_PROXY,
  provideCredentials: async realm => {
    //console.log(realm);
    return credentials;
  }
};

test("svn+https has name", t => {
  const svn = new SVNHTTPSScheme();
  t.is(svn.name, "svn+https");
});

test("inside path", async t => {
  const svn = new SVNHTTPSScheme(OPTIONS);

  const url = new URL(
    "https://subversion.assembla.com/svn/delivery_notes/data/environments.json"
  );

  const acs = await svn.activityCollectionSet(undefined, url);

  t.is(acs.pathInsideRepository, "/data/environments.json");
});

test("can stat", async t => {
  const context = undefined;
  const svn = new SVNHTTPSScheme(OPTIONS);

  const stat = await svn.stat(
    context,
    new URL(
      "https://subversion.assembla.com/svn/delivery_notes/data/environments.json"
    )
  );

  t.deepEqual(stat, {
    creationDate: new Date("2016-01-30T13:36:16.649803Z"),
    size: 114,
    creator: "arlac77",
    version: 1481
  });
});

test("can list", async t => {
  const context = undefined;
  const svn = new SVNHTTPSScheme(OPTIONS);

  const all = new Set();

  for await (const entry of svn.list(
    context,
    new URL("https://subversion.assembla.com/svn/delivery_notes/data")
  )) {
    all.add(entry.name);
  }

  t.true(all.has("releases.json"));
  t.true(all.has("comp1"));
  t.true(all.has("releases"));
  t.true(all.has("servers"));
  t.true(all.has("config.json"));
  t.true(all.has("environments.json"));
});
