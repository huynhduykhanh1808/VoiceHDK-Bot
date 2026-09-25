'use strict';
const fs = require('fs');
const assert = require('assert');
const src = fs.readFileSync(require.resolve('../index.js'), 'utf8');
const perms = require('../services/voicePermissions');

assert.deepStrictEqual(perms.normalVoiceAccess(), {
  ViewChannel: true, Connect: true, Speak: true, UseVAD: true, Stream: true
});
for (const id of ['room_lock','room_hide','room_limit','room_rename','room_reset','room_fix_panel','room_transfer','room_trust','room_invite','room_mute_toggle','room_kick','room_deny']) {
  assert(src.includes(`'${id}'`), `missing button ${id}`);
}
assert(src.indexOf("mk('room_mute_toggle'") < src.indexOf("mk('room_kick'"), 'mute must appear before kick');
assert(src.indexOf("mk('room_kick'") < src.indexOf("mk('room_deny'"), 'kick must appear before ban');
assert(!src.includes("mk('room_untrust'"), 'old untrust button must be removed');
assert(src.includes("room_untrust_member:"), 'trusted remove button missing');
assert(src.includes("room_trusted_name:"), 'trusted member display button missing');
assert(src.includes("interaction.customId.startsWith('room_trusted_name:')"), 'trusted member display button must be acknowledged silently');
assert(src.includes("room_trusted_page:"), 'trusted pagination buttons missing');
assert(src.includes('buildRoomTrustedPayloads'), 'trusted paged payload builder missing');

assert(src.includes(".setLabel('‹')"), 'compact previous trusted page button missing');
assert(src.includes(".setLabel('›')"), 'compact next trusted page button missing');
assert(src.includes('const pageSize = 8;'), 'trusted page size must preserve one-member-per-row layout');
assert(src.includes('findRoomTrustedContinuationMessages'), 'trusted continuation message sync missing');
assert(src.includes("### ・❥・ `❤️` NGƯỜI TIN CẬY `❤️` ・❥・"), 'compact trusted heading missing');
assert(src.includes('Những thành viên được chủ phòng tin cậy · ${members.length} người'), 'trusted count subtitle missing');
assert(src.includes("JSON.stringify(message.components || []).includes('NGƯỜI TIN CẬY')"), 'empty trusted panels must be discoverable for FIX cleanup');
assert(src.includes(".setEmoji('❌')"), 'compact trusted remove button missing');
assert(!src.includes(".setLabel('XÓA')"), 'trusted remove button must not have a long label');
assert(src.includes("{ Speak: muted ? true : false }"), 'mute toggle must only edit Speak');
assert(src.includes('control_aux_message_id'), 'second panel message persistence missing');
assert(src.includes('new ContainerBuilder()'), 'Message 2 must use Components V2 ordering');
assert(src.indexOf('.addActionRowComponents(regionRow)') < src.indexOf('.addActionRowComponents(memberRow)'), 'region select must appear before member select');
assert(src.includes('.addActionRowComponents(memberRow);'), 'member select row missing');
assert(src.includes(".setStyle(ButtonStyle.Secondary)"), 'trusted remove button must use neutral dark background');
assert(src.includes(".setStyle(ButtonStyle.Primary)"), 'trusted member button must stay bright');
const trustedRowSource = src.slice(src.indexOf('function buildTrustedMemberRow'), src.indexOf('async function getTrustedGuildMembers'));
assert(!trustedRowSource.includes('.setDisabled(true)'), 'trusted member button must not be disabled/dimmed');
assert(src.includes("new AttachmentBuilder(roomCard, { name: 'room-panel.png' })"), 'room card attachment missing');
assert(src.includes(".setImage('attachment://room-panel.png')"), 'room card image missing');
assert(src.includes('trustedCount,'), 'trusted count must be passed to room card');

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
