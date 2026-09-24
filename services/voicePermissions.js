'use strict';

// Single source of truth for participant voice capabilities. Lock/hide only
// change Connect/ViewChannel and must not strip these capabilities.
const NORMAL_VOICE_ACCESS = Object.freeze({
  ViewChannel: true,
  Connect: true,
  Speak: true,
  UseVAD: true,
  Stream: true
});

function normalVoiceAccess(extra = {}) {
  return { ...NORMAL_VOICE_ACCESS, ...extra };
}

function normalVoiceFlags(flags) {
  return [flags.ViewChannel, flags.Connect, flags.Speak, flags.UseVAD, flags.Stream];
}

module.exports = { NORMAL_VOICE_ACCESS, normalVoiceAccess, normalVoiceFlags };
