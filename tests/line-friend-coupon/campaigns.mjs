// Isolated, reusable campaign eligibility; never controls normal registration.
const TZ="Asia/Taipei";
function localDay(date){return new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(date);}
export function campaignDecision({campaign,service,ticketCode,now=new Date(),eventDate=null}){
  if(!(now instanceof Date)||Number.isNaN(now.getTime()))throw new Error("invalid_time");
  if(!campaign||!campaign.code||!campaign.startDate||!campaign.endDate)throw new Error("invalid_campaign");
  const day=localDay(now);
  if(!campaign.enabled)return {eligible:false,reason:"disabled"};
  if(day<campaign.startDate)return {eligible:false,reason:"not_started"};
  if(day>campaign.endDate)return {eligible:false,reason:"expired"};
  if(!Array.isArray(campaign.services)||!campaign.services.includes(service))return {eligible:false,reason:"service_not_eligible"};
  if(Array.isArray(campaign.ticketCodes)&&!campaign.ticketCodes.includes(ticketCode))return {eligible:false,reason:"ticket_not_eligible"};
  if(campaign.eventDateStart&&(!eventDate||eventDate<campaign.eventDateStart))return {eligible:false,reason:"event_date_not_eligible"};
  if(campaign.eventDateEnd&&(!eventDate||eventDate>campaign.eventDateEnd))return {eligible:false,reason:"event_date_not_eligible"};
  return {eligible:true,reason:null};
}
export function resolveCampaigns({campaigns=[],service,ticketCode,now=new Date(),eventDate=null}){
  return campaigns.map(c=>({code:c.code,...campaignDecision({campaign:c,service,ticketCode,now,eventDate})}));
}
