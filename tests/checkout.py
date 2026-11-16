"""Checkout remains closed until a live hosted link and fulfillment are supplied."""
import json,sys,tempfile
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from checkout import load_checkout
from site_components import merchandise
base=load_checkout()
for offer in base['products'].values():
 offer.update(ready=False,payment_link='',fulfillment='')
with tempfile.TemporaryDirectory() as temp:
 path=Path(temp)/'checkout.json'
 def validate(url,ready=False,fulfillment=''):
  data=json.loads(json.dumps(base));data['products']['book'].update(payment_link=url,ready=ready,fulfillment=fulfillment)
  path.write_text(json.dumps(data));return load_checkout(path)
 for bad in ['https://evil.example/a','https://buy.stripe.com.evil.example/a','javascript:alert(1)','https://buy.stripe.com/a?x=1','https://buy.stripe.com/test_example']:
  try:validate(bad,True,'PDF delivered manually')
  except ValueError:pass
  else:raise AssertionError(bad)
 try:validate('https://buy.stripe.com/example',True)
 except ValueError:pass
 else:raise AssertionError('Missing fulfillment accepted')
 validate('https://buy.stripe.com/example',True,'PDF delivered manually')
 with patch('site_components.payment_link',return_value='https://buy.stripe.com/example'),patch('site_components.any_ready',return_value=True):
  html=merchandise('../',shop_page=True)
  assert html.count('href="https://buy.stripe.com/example"')==3
  assert html.count('Buy with Stripe')==3
 with patch('site_components.payment_link',return_value=None):
  assert 'Buy with Stripe' not in merchandise('../',shop_page=True)
print('Passed: hosted-link validation, live/fulfillment gates, and static checkout buttons.')
