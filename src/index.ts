const root = require('window-or-global');
const PeerId = require('peer-id');
const { w, p } = require('@idn/util-promisify');

// id.privKey
export async function getPeerId(opts: any = {}) {
  // Use existing id if already have one
  let self: any = root;
  // Node JS shim for localstorage
  if (typeof self.localStorage === 'undefined' || self.localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    self.localStorage = new LocalStorage('./scratch.store');
  }
  let id;
  if (self.localStorage) {
    id = self.localStorage.getItem('peerId');
    if (!id) {
      await new Promise((resolve, reject)=>{
        PeerId.create({ bits: opts.bits || 2048 }, (err, _id)=>{
          if (err) {
            reject(err);
          }
          id = _id.toJSON();
          self.localStorage.setItem('peerId', JSON.stringify(id));
          resolve();
        })
      })
    } else {
      id = JSON.parse(id);
    }
  } else {
    await new Promise((resolve, reject)=>{
      PeerId.create({ bits: opts.bits || 2048 }, (err, _id)=>{
        if (err) {
          reject(err);
        }
        id = _id.toJSON();
        resolve();
      })
    })
  }
  return id;
}
