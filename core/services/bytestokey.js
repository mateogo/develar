// Copyright (c) 2017, Ben Noordhuis <info@bnoordhuis.nl>
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

// Compute the key and IV that crypto.createCipher() derives from the
// passphrase.  Use this when migrating to crypto.createCipheriv().
'use strict';

const { createCipheriv, createHash } = require('crypto');

function sizes(cipher) {
  for (let nkey = 1, niv = 0;;) {
    try {
      createCipheriv(cipher, '.'.repeat(nkey), '.'.repeat(niv));
      return [nkey, niv];
    } catch (e) {
      if (/invalid iv length/i.test(e.message)) niv += 1;
      else if (/invalid key length/i.test(e.message)) nkey += 1;
      else throw e;
    }
  }
}

function compute(cipher, passphrase) {
  let [nkey, niv] = sizes(cipher);
  for (let key = '', iv = '', p = '';;) {
    const h = createHash('md5');
    h.update(p, 'hex');
    h.update(passphrase);
    p = h.digest('hex');
    let n, i = 0;
    n = Math.min(p.length-i, 2*nkey);
    nkey -= n/2, key += p.slice(i, i+n), i += n;
    n = Math.min(p.length-i, 2*niv);
    niv -= n/2, iv += p.slice(i, i+n), i += n;
    if (nkey+niv === 0) return [key, iv];
  }
}

const [arg0, arg1, cipher, passphrase] = process.argv;
if (cipher && passphrase !== undefined) {
  const [key, iv] = compute(cipher, passphrase);
  console.log('key:', key);
  console.log('iv: ', iv);
  if (/ccm|ctr|gcm/i.test(cipher)) {
    console.log(`WARNING: Data encrypted with crypto.createCipher('${cipher}')`);
    console.log(`WARNING: is fundamentally compromised.  You should fix this ASAP!`);
  }
} else {
  const [cipher, passphrase] = ['aes-128-cbc', 'secret'];
  const [key, iv] = compute(cipher, passphrase);
  console.log('Usage:');
  console.log(`  ${arg0} ${arg1} CIPHER PASSPHRASE`);
  console.log();
  console.log('Example:');
  console.log(`  ${arg0} ${arg1} ${cipher} ${passphrase}`);
  console.log();
  console.log('Prints:');
  console.log(`  key: ${key}`);
  console.log(`  iv:  ${iv}`);
  console.log();
  console.log('Now update your code and replace this:');
  console.log();
  console.log(`  const cipher = crypto.createCipher('${cipher}', '${passphrase}');`);
  console.log();
  console.log('With this:');
  console.log();
  console.log(`  const key = Buffer.from('${key}', 'hex');`);
  console.log(`  const iv  = Buffer.from('${iv}', 'hex');`);
  console.log(`  const cipher = crypto.createCipheriv('${cipher}', key, iv);`);
}