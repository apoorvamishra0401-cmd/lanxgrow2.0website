import unittest
from components import validate
class Validation(unittest.TestCase):
 def test_supported(self):self.assertEqual(validate(' Hello ','Indian'),('Hello','en-IN-NeerjaNeural'))
 def test_rejects(self):
  for text,accent in [('', 'Indian'),('a'*501,'Indian'),('Hello','unknown')]:
   with self.assertRaises(ValueError):validate(text,accent)
if __name__=='__main__':unittest.main()
