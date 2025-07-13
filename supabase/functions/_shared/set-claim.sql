
CREATE OR REPLACE FUNCTION set_claim(uid text, claim text, value text)
RETURNS void AS $$
BEGIN
  -- This is a placeholder function for Firebase auth compatibility
  -- The actual claim setting is handled by the application layer
  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
