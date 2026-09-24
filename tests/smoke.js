'use strict';
const fs = require('fs');
const assert = require('assert');
const src = fs.readFileSync(require.resolve('../index.js'), 'utf8');
const perms = require('../services/voicePermissions');

assert.deepStrictEqual(perms.normalVoiceAccess(), {
  ViewChannel: true, Connect: true, Speak: true, UseVAD: true, Stream: true
});
for (const id of ['room_lock','room_hide','room_rename','room_limit','room_reset','room_fix_panel','room_trust','room_untrust','room_invite','room_transfer','room_kick','room_deny']) {
  assert(src.includes(`'${id}'`), `missing button ${id}`);
}
assert(src.indexOf("mk('room_kick'") < src.indexOf("mk('room_deny'"), 'kick must appear before ban');
assert(src.includes('control_aux_message_id'), 'second panel message persistence missing');
assert(src.includes('new ContainerBuilder()'), 'Message 2 must use Components V2 ordering');
assert(src.indexOf('.addActionRowComponents(regionRow)') < src.indexOf('.addActionRowComponents(memberRow)'), 'region select must appear before member select');
assert(src.indexOf('.addActionRowComponents(memberRow)') < src.indexOf('.addTextDisplayComponents(trustedDisplay)'), 'trusted list must appear after selects');
assert(src.indexOf(".setImage('attachment://owner-avatar.png')") < src.indexOf('embeds.push(infoEmbed)'), 'owner avatar must appear before room info');

assert(src.includes('room_trusted_members'), 'trusted member persistence missing');
assert(src.includes('orderedPresence'), 'trusted owner succession priority missing');
assert(src.includes("'suapanel'"));
assert(src.includes("'nhanphong'"));
assert(src.includes("'kiemtra'"));
assert(src.includes("'datlai'"));
assert(src.includes("'theodoilog'"));
assert(src.includes("'xoatheodoilog'"));
assert(src.includes("'danhsachtheodoi'"));
console.log('VoiceHDK smoke tests: PASS');
