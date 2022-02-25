#!/usr/local/bin/ic-repl -r local
// assume we already installed the dao canister
import dao = "ryjl3-tyaaa-aaaaa-aaaba-cai";
call dao.whoami();
let result = _;
assert _ == "2vxsx-fae";
identity mainnet;
call dao.whoami();
assert _ == "cbvco-k27pa-dgumq-tjhcq-iqrcx-ayr3z-moywz-jqblc-nvsif-dayv3-4qe";