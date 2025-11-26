/** @module validation/phone */

// https://www.allareacodes.com/
const usAreaCodes = new Set([
  // Alabama
  '205','251','256','334','659','938',
  // Alaska
  '907',
  // Arizona
  '480','520','602','623','928',
  // Arkansas
  '327','479','501','870',
  // California
  '209','213','279','310','323','341','350','369','408','415','424','442',
  '510','530','559','562','619','626','628','650','657','661','669','707',
  '714','747','760','805','818','820','831','840','858','909','916','925',
  '949','951',
  // Colorado
  '303','719','720','970','983',
  // Connecticut
  '203','475','860','959',
  // DC
  '202','771',
  // Delaware
  '302',
  // Florida
  '239','305','321','352','386','407','448','561','645','656','689','727',
  '728','754','772','786','813','850','863','904','941','954',
  // Georgia
  '229','404','470','478','678','706','762','770','912','943',
  // Hawaii
  '808',
  // Idaho
  '208','986',
  // Illinois
  '217','224','309','312','331','447','464','618','630','708','730','773',
  '779','815','847','861','872',
  // IN
  '219','260','317','463','574','765','812','930',
  // Iowa
  '319','515','563','641','712',
  // Kansas
  '316','620','785','913',
  // Kentucky
  '270','364','502','606','859',
  // Louisiana
  '225','318','337','504','985',
  // Maine
  '207',
  // Maryland
  '227','240','301','410','443','667',
  // Massachusetts
  '339','351','413','508','617','774','781','857','978',
  // Michigan
  '231','248','269','313','517','586','616','734','810','906','947','989',
  // Minnesota
  '218','320','507','612','651','763','952',
  // Mississippi
  '228','601','662','769',
  // Missouri
  '235','314','417','557','573','636','660','816','975',
  // Montana
  '406',
  // Nebraska
  '308','402','531',
  // Nevada
  '702','725','775',
  // New Hampshire
  '603',
  // New Jersey
  '201','551','609','640','732','848','856','862','908','973',
  // New Mexico
  '505','575',
  // New York
  '212','315','329','332','347','363','516','518','585','607',
  '624','631','646','680','716','718','838','845','914','917',
  '929','934',
  // North Carolina
  '252','336','704','743','828','910','919','980','984',
  // North Dakota
  '701',
  // Ohio
  '216','220','234','283','326','330','380','419','436','440','513','567',
  '614','740','937',
  // Oklahoma
  '405','539','572','580','918',
  // Oregon
  '458','503','541','971',
  // Pennsylvania
  '215','223','267','272','274','412','445','484','570','582','610','717',
  '724','814','835','878',
  // Rohde Island
  '401',
  // South Carolina
  '803','839','843','854','864',
  // South Dakota
  '605',
  // Tennessee
  '423','615','629','731','865','901','931',
  // Territories
  '340', // VI 
  '670', // MP
  '671', // GU
  '684', // AS
  '787', // PR
  '939', // PR
  // Texas
  '210','214','254','281','283','325','346','361','409','430','432','469',
  '512','682','713','726','737','806','817','830','832','903','915','936',
  '940','945','956','972','979',
  // Utah
  '385','435','801',
  // Vermont
  '802',
  // Virginia
  '276','434','540','571','686','703','757','804','826','948',
  // Washington
  '206','253','360','425','509','564',
  // West Virginia
  '304','681',
  // Wisconsin
  '262','274','353','414','534','608','715','920',
  // Wyoming
  '307',
  // Toll Free
  '800','833','844','855','866','877','888'
]);

/**
 * @description Validates a phone number.
 * @memberof validation
 * @param {string} [value] The phone number to validate.
 * @param {object} [options] optional options.
 * @param {boolean} [options.usOnly] True to validate with only US phone numbers.
 * @returns {import('../validation/_index.js').ValidationResult} The result of the phone number validation.
 */
export function phone(value, options = {}) {
  const result = { valid: false, errors: [] }
  
  // a blank value is considered valid - use other validations in addition to disallow blank values
  if (!value) {
    result.valid = true
    return result
  }

  // strip out non-digit characters
  const digits = value.replace(/\D/g, '')

  // validate length
  if (digits.length < 8 || digits.length > 15) {
    result.errors.push({ code: 'invalidPhoneLength', message: 'Invalid phone length' })
    return result
  }

  // TODO: first digits must match a known country code OR US area code

  if (options.usOnly) {
    // validate US area codes
    if (digits.length === 10) {
      if (!usAreaCodes.has(digits.substring(0, 3))) {
        result.errors.push({ code: 'invalidUsPhoneAreaCode', message: 'Invalid US phone area code' })
        return result
      }
    } else if (digits.length === 11) {
      // first digit must be 1
      if (digits.charAt(0) !== '1') {
          result.errors.push({ code: 'invalidUsPhoneCountryCode', message: 'Invalid US phone country code' })
          return result
      }
      // validate area code
      if (!usAreaCodes.has(digits.substring(1, 4))) {
        result.errors.push({ code: 'invalidUsPhoneAreaCode', message: 'Invalid US phone area code' })
        return result
      }
    } else {
      result.errors.push({ code: 'invalidUsPhoneLength', message: 'Invalid US phone length' })
      return result
    }
  }

  result.valid = true
  return result
}