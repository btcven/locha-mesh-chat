package BitcoinJ;

import android.annotation.TargetApi;

import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.core.Sha256Hash;
import org.bitcoinj.params.TestNet3Params;
import org.junit.Before;
import org.junit.Test;
import org.bitcoinj.wallet.Wallet;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

import java.io.File;
import java.util.HashMap;

import static org.junit.Assert.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;


public class BitcoinModuleTest {

    private static final String TEST = "test";

    @InjectMocks
    CryptoLib cryptoLib;


    @Mock
    NetworkParameters parameters;

    @Before
    public void setUp() throws Exception {
        if(cryptoLib == null){
            cryptoLib = new CryptoLib();
        }
    }



    @Test
    public void classNonNull(){
        assertNotNull(cryptoLib);
    }

    @Test
    public void generateMnemonic(){
        String[] result = cryptoLib.generateMnemonic().split(" ");
        assertEquals(12, result.length);
        assertNotNull(result);
    }

     @Test
     public void createWallet(){
        String Mnemonic = cryptoLib.generateMnemonic();
        cryptoLib.createWallet(Mnemonic);
    }


    @Test
    public void sha256Test(){

      String result = cryptoLib.sha256(TEST);
      assertNotNull(result);

      String expect = cryptoLib.sha256(TEST);

      assertEquals(expect,result);
    }


    @Test
    @TargetApi(26)
    public void  encryptTest(){
        try {
            String result = cryptoLib.encrypt(TEST, TEST);
            System.out.println(result);

        } catch (Exception e){
            System.out.println(e.toString());
        }

    }

}