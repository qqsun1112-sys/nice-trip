// Offline-only, privacy-preserving participant verification policy prototype.
// HMAC key generation and persistent uniqueness MUST be implemented server-side later.
export function assessParticipants({participants,existingKeys=[],eventSlug,now=new Date()}){
 if(!eventSlug||!Array.isArray(participants)||participants.length<1||participants.length>20)throw Error("invalid_participants");
 const seen=new Set(existingKeys);
 const results=[];
 for(const [i,p] of participants.entries()){
  const name=String(p?.full_name??"").trim();
  if(!name)throw Error("participant_name_required");
  const key=String(p?.identity_key??"").trim();
  // This input is a synthetic test-only identity key; never accept browser-supplied keys in production.
  const qualified=key!==""&&!seen.has(eventSlug+"|"+key);
  const reason=!key?"identity_verification_needed":!qualified?"already_used":null;
  if(qualified)seen.add(eventSlug+"|"+key);
  results.push({index:i+1,full_name:name,eligible:qualified,reason});
 }
 return {participants:results,eligibleCount:results.filter(x=>x.eligible).length,requiresReview:results.some(x=>!x.eligible)};
}
